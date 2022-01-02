### 3.6 Zookeeper在Kafka中的作用    

- **存储结构**

  ![img](file:///Users/starfish/workspace/tech/docs/_images/message-queue/Kafka/zookeeper-store.png?lastModify=1595738386)

  

  注意： **producer 不在 zk 中注册， 消费者在 zk 中注册。**

  Kafka集群中有一个broker会被选举为Controller，**负责管理集群broker的上线下，所有topic的分区副本分配和leader选举等工作**。

  Controller的管理工作都是依赖于Zookeeper的。

  下图为 partition 的 leader 选举过程：

  ![img](file:///Users/starfish/workspace/tech/docs/_images/message-queue/Kafka/controller-leader.png?lastModify=1595738386)

- Zookeeper 是一个成熟的分布式协调服务，它可以为分布式服务提供分布式配置服、同步服务和命名注册等能力.。对于任何分布式系统，都需要一种协调任务的方法。Kafka 是使用 ZooKeeper 而构建的分布式系统。但是也有一些其他技术（例如 Elasticsearch 和 MongoDB）具有其自己的内置任务协调机制。

  Kafka 将 Broker、Topic 和 Partition 的元数据信息存储在 Zookeeper 上。通过在 Zookeeper 上建立相应的数据节点，并监听节点的变化，Kafka 使用 Zookeeper 完成以下功能：

  - Kafka Controller 的 Leader 选举
  - Kafka 集群成员管理
  - Topic 配置管理
  - 分区副本管理

  我们看一看 Zookeeper 下 Kafka 创建的节点，即可一目了然的看出这些相关的功能。

![图片](https://mmbiz.qpic.cn/mmbiz_png/FbXJ7UCc6O0dHyDpzdia8xZ2nS1IzIMSojuh0sAibj56fWQhUqV4OCkTicOODICJCLfIFibN9Mv2uCZRVhicIibOaVqQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

## Controller

Controller 是从 Broker 中选举出来的，负责分区 Leader 和 Follower 的管理。当某个分区的 leader 副本发生故障时，由 Controller 负责为该分区选举新的 leader 副本。当检测到某个分区的 ISR(In-Sync Replica)集合发生变化时，由控制器负责通知所有 broker 更新其元数据信息。当使用`kafka-topics.sh`脚本为某个 topic 增加分区数量时，同样还是由控制器负责分区的重新分配。

Kafka 中 Contorller 的选举的工作依赖于 Zookeeper，成功竞选为控制器的 broker 会在 Zookeeper 中创建`/controller`这个临时（EPHEMERAL）节点。

### 选举过程

![图片](https://mmbiz.qpic.cn/mmbiz_png/FbXJ7UCc6O0dHyDpzdia8xZ2nS1IzIMSo0QbCfn1hPByxALcMR51ibapYaM03B1Hibfapv9HRzCjXy5zaJeQ8lT0g/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

Broker 启动的时候尝试去读取`/controller`节点的`brokerid`的值，如果`brokerid`的值不等于-1，则表明已经有其他的 Broker 成功成为 Controller 节点，当前 Broker 主动放弃竞选；如果不存在`/controller`节点，或者 brokerid 数值异常，当前 Broker 尝试去创建`/controller`这个节点，此时也有可能其他 broker 同时去尝试创建这个节点，只有创建成功的那个 broker 才会成为控制器，而创建失败的 broker 则表示竞选失败。每个 broker 都会在内存中保存当前控制器的 brokerid 值，这个值可以标识为 activeControllerId。

### 实现

![图片](https://mmbiz.qpic.cn/mmbiz_png/FbXJ7UCc6O0dHyDpzdia8xZ2nS1IzIMSow0jXB6OziajJJSf0Eb8LXKAEhHTAIvvjJWCE0rsMPaSGMEC92fH4zyA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

Controller 读取 Zookeeper 中的节点数据，初始化上下文(Controller Context)，并管理节点变化，变更上下文，同时也需要将这些变更信息同步到其他普通的 broker 节点中。Controller 通过定时任务，或者监听器模式获取 zookeeper 信息，事件监听会更新更新上下文信息，如图所示，Controller 内部也采用生产者-消费者实现模式，Controller 将 zookeeper 的变动通过事件的方式发送给事件队列，队列就是一个`LinkedBlockingQueue`，事件消费者线程组通过消费消费事件，将相应的事件同步到各 Broker 节点。这种队列 FIFO 的模式保证了消息的有序性。

### 职责

Controller 被选举出来，作为整个 Broker 集群的管理者，管理所有的集群信息和元数据信息。它的职责包括下面几部分：

1. 处理 Broker 节点的上线和下线，包括自然下线、宕机和网络不可达导致的集群变动，Controller 需要及时更新集群元数据，并将集群变化通知到所有的 Broker 集群节点；
2. 创建 Topic 或者 Topic 扩容分区，Controller 需要负责分区副本的分配工作，并主导 Topic 分区副本的 Leader 选举。
3. 管理集群中所有的副本和分区的状态机，监听状态机变化事件，并作出相应的处理。Kafka 分区和副本数据采用状态机的方式管理，分区和副本的变化都在状态机内会引起状态机状态的变更，从而触发相应的变化事件。

> “
>
> 65 哥：状态机啊，听起来好复杂。
>
> ”

Controller 管理着集群中所有副本和分区的状态机。大家不要被`状态机`这个词唬住了。理解状态机很简单。先理解模型，即这是什么关于什么模型，然后就是模型的状态有哪些，模型状态之间如何转换，转换时发送相应的变化事件。

Kafka 的分区和副本状态机很简单。我们先理解，这分别是管理 Kafka Topic 的分区和副本的。它们的状态也很简单，就是 CRUD，具体说来如下：

#### 分区状态机

PartitionStateChange，管理 Topic 的分区，它有以下 4 种状态：

1. NonExistentPartition：该状态表示分区没有被创建过或创建后被删除了。
2. NewPartition：分区刚创建后，处于这个状态。此状态下分区已经分配了副本，但是还没有选举 leader，也没有 ISR 列表。
3. OnlinePartition：一旦这个分区的 leader 被选举出来，将处于这个状态。
4. OfflinePartition：当分区的 leader 宕机，转移到这个状态。

我们用一张图来直观的看看这些状态是如何变化的，以及在状态发生变化时 Controller 都有哪些操作：

![图片](https://mmbiz.qpic.cn/mmbiz_png/FbXJ7UCc6O0dHyDpzdia8xZ2nS1IzIMSowS1wGNDp0qM2deSV87Rv42OOxdeGQIH0cZEwZTPhNb2CqgmPvpIYvA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

#### 副本状态机

ReplicaStateChange，副本状态，管理分区副本信息，它也有 4 种状态：

1. NewReplica: 创建 topic 和分区分配后创建 replicas，此时，replica 只能获取到成为 follower 状态变化请求。
2. OnlineReplica: 当 replica 成为 parition 的 assingned replicas 时，其状态变为 OnlineReplica, 即一个有效的 OnlineReplica。
3. OfflineReplica: 当一个 replica 下线，进入此状态，这一般发生在 broker 宕机的情况下；
4. NonExistentReplica: Replica 成功删除后，replica 进入 NonExistentReplica 状态。

副本状态间的变化如下图所示，Controller 在状态变化时会做出相应的操作：

![图片](https://mmbiz.qpic.cn/mmbiz_png/FbXJ7UCc6O0dHyDpzdia8xZ2nS1IzIMSoDYVWzibF5xLoRuibP4HOeTlIuK3M74UDvBsk2KuJlaZu2Aqv7gPibrwhQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

## Network

Kafka 的网络通信模型是基于 NIO 的 Reactor 多线程模型来设计的。其中包含了一个`Acceptor`线程，用于处理新的连接，`Acceptor` 有 N 个 `Processor` 线程 select 和 read socket 请求，N 个 `Handler` 线程处理请求并相应，即处理业务逻辑。下面就是 KafkaServer 的模型图：

![图片](https://mmbiz.qpic.cn/mmbiz_png/FbXJ7UCc6O0dHyDpzdia8xZ2nS1IzIMSoF5xwBbjgrd3nDVXyaMl7SqDbiaib6ej4sGYCwehEunqHeOaUFWRrpHcQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

