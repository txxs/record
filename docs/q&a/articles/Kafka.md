# Kafka

------------

> 引用自 ：https://mp.weixin.qq.com/s/4in68kbY-xiyl9Q6KaR1JA

### 一、Kafka架构

#### 1.1 使用消息队列的好处

Kafka 本质上是一个 MQ（Message Queue），使用消息队列的好处？
- 解耦：允许我们独立的扩展或修改队列两边的处理过程。
- 可恢复性：即使一个处理消息的进程挂掉，加入队列中的消息仍然可以在系统恢复后被处理。
- 缓冲：有助于解决生产消息和消费消息的处理速度不一致的情况。
- 灵活性&峰值处理能力：不会因为突发的超负荷的请求而完全崩溃，消息队列能够使关键组件顶住突发的访问压力。
- 异步通信：消息队列允许用户把消息放入队列但不立即处理它。

解耦：在大数据，高并发的场景下为了突破性能瓶颈会对系统进行水平扩展和垂直拆分，将一个复杂的系统拆分多个独立，纯净的子系统。数据在各个系统之间流转，但是如果某一个服务处理速度过慢，就会拖累整个链路的性能，形成瓶颈降低整个系统的性能，造成“旱的旱死涝的涝死”的局面。举个简单例子：在淘宝下单时，交易系统完成扣款，后续会有很多动作：提醒卖家发货，生成卖家工作流，核销优惠券，增加购物积分等等，如果这一步全部写到交易系统的扣款代码之后，很有可能交易系统就会被拖死，下游任何一个环节失败也会导致扣款回滚，并且如果需要添加一个新的动作需要交易去做大量修改，设计肯定是不合理的。实际上交易系统在处理完扣款后会发送一个扣款完成消息，下游接这个消息即可，下游失败不会影响核心流程失败，并且各个系统的边界更加清楚，分层更更加合理。

数据持久化：如今的应用程序基本都会涉及到多个系统之间的对接，数据在系统之间通过 RPC 进行传递，处理数据的过程失败就会导致数据丢失，除非数据被持久化到磁盘上。而 Kafka 将所有需要流转的数据都 持久化到磁盘上 ，保证数据不会丢失。另外还有一个很重要的能力就是保留现场便于后续问题排查跟踪，经历过系统失败但是无法复现的人才会体会到的痛！为了保证磁盘上的数据不会爆炸式疯涨，Kafka 提供了数据清理，数据压缩等功能，清除处理完成的历史数据。

扩展性：在应用的访问量剧增的情况下，代码优化往往没有直接进行水平扩展来的那么及时。诊断，分析，方案，优化，验证 一系列复杂流程让代码优化看起来只能是一个从长计议的方案。这时止血的方案只能是降级，限流，扩机器 三板斧。Kafka 的扩展性主要就体现在能热扩容，不需要修改参数，不需要修改代码，上机器 -> 注册服务 就完成了扩容。并非所有系统都具备这个像 调节音量旋钮一样简单的提高系统性能 的能力 ，这里会涉及到扩容之前的数据是否会有热点，新节点对集群的同步，流量重分配等等一系列复杂流程。

容灾：系统的部分组件失败不会影响这个系统的运行，消息队列降低了进程间的耦合度，上游或者下游服务挂掉后不会影响其他系统的运行，在服务重新在线后能够继续处理之前未处理的数据，只是会存在一定的延时但是能够保证 最终业务正确性 。

保序强哥：你这瓜保熟吗？哦不，你这队列保序吗？在大多数场景下，数据处理顺序是至关重要的，顺序错乱很可能导致数据结果错误。除非这个处理过程是无状态的，此时消息只是起到事件触发的作用，触发下游进行计算。Kafka 可以保证分区内部有序而不能保证全局有序。在大多数场景下，数据处理顺序是至关重要的，顺序错乱很可能导致数据结果错误。除非这个处理过程是无状态的，此时消息只是起到事件触发的作用，触发下游进行计算。Kafka 可以保证分区内部有序而不能保证全局有序。

> 引用自：http://www.dockone.io/article/9956

#### 1.2 Kakfa架构

![图片](https://txxs.github.io/pic/q&a/WX20210705-111618@2-1x.png)


Kafka 存储的消息来自任意多被称为 Producer 生产者的进程。数据从而可以被发布到不同的 Topic 主题下的不同 Partition 分区。在一个分区内，这些消息被索引并连同时间戳存储在一起。其它被称为 Consumer 消费者的进程可以从分区订阅消息。Kafka 运行在一个由一台或多台服务器组成的集群上，并且分区可以跨集群结点分布。下面给出 Kafka 一些重要概念，让大家对 Kafka 有个整体的认识和感知，后面还会详细的解析每一个概念的作用以及更深入的原理：

- Producer：消息生产者，向 Kafka Broker 发消息的客户端。
- Consumer：消息消费者，从 Kafka Broker 取消息的客户端。
- Consumer Group：消费者组（CG），消费者组内每个消费者负责消费不同分区的数据，提高消费能力。一个分区只能由组内一个消费者消费，消费者组之间互不影响。所有的消费者都属于某个消费者组，即消费者组是逻辑上的一个订阅者。
- Broker：一台 Kafka 机器就是一个 Broker。一个集群由多个 Broker 组成。一个 Broker 可以容纳多个 Topic。
- Topic：可以理解为一个队列，Topic 将消息分类，生产者和消费者面向的是同一个 Topic。
- Partition：为了实现扩展性，提高并发能力，一个非常大的 Topic可以分布到多个Broker（即服务器）上，一个Topic可以分为多个 Partition，每个Partition是一个有序的队列。
- Replica：副本，为实现备份的功能，保证集群中的某个节点发生故障时，该节点上的Partition数据不丢失，且Kafka仍然能够继续工作，Kafka提供了副本机制，一个Topic的每个分区都有若干个副本，一个Leader和若干个Follower。
- Leader：每个分区多个副本的“主”副本，生产者发送数据的对象，以及消费者消费数据的对象，都是 Leader。
- Follower：每个分区多个副本的“从”副本，实时从 Leader 中同步数据，保持和 Leader 数据的同步。Leader 发生故障时，某个 Follower 还会成为新的 Leader。
- Offset：消费者消费的位置信息，监控数据消费到什么位置，当消费者挂掉再重新恢复的时候，可以从消费位置继续消费。
- ZooKeeper：Kafka 集群能够正常工作，需要依赖于 ZooKeeper，ZooKeeper 帮助 Kafka 存储和管理集群信息。

> 引用自：http://www.dockone.io/article/9956

### 二、工作流程

Kafka集群将 Record 流存储在称为 Topic 的类别中，每个记录由一个键、一个值和一个时间戳组成。

![图片](https://txxs.github.io/pic/q&a/WX20210705-111618@2-2x.png)

Kafka 是一个分布式流平台，这到底是什么意思？发布和订阅记录流，类似于消息队列或企业消息传递系统。以容错的持久方式存储记录流。处理记录流。Kafka 中消息是以 Topic 进行分类的，生产者生产消息，消费者消费消息，面向的都是同一个 Topic。

- Topic 是逻辑上的概念，而 Partition 是物理上的概念，每个 Partition 对应于一个 log 文件，该 log 文件中存储的就是 Producer 生产的数据。
- Producer 生产的数据会不断追加到该 log 文件末端，且每条数据都有自己的 Offset。

消费者组中的每个消费者，都会实时记录自己消费到了哪个 Offset，以便出错恢复时，从上次的位置继续消费。



### 三、存储机制

![图片](https://txxs.github.io/pic/q&a/WX20210705-111618@2-3x.png)

由于生产者生产的消息会不断追加到 log 文件末尾，为防止 log 文件过大导致数据定位效率低下，Kafka 采取了分片和索引机制。

它将每个 Partition 分为多个 Segment，每个 Segment 对应两个文件：“.index” 索引文件和 “.log” 数据文件。

这些文件位于同一文件下，该文件夹的命名规则为：topic 名-分区号。例如，first 这个 topic 有三分分区，则其对应的文件夹为 first-0，first-1，first-2。

```
# ls /root/data/kafka/first-0        
00000000000000009014.index    
00000000000000009014.log
00000000000000009014.timeindex
00000000000000009014.snapshot   
leader-epoch-checkpoint
```
index 和 log 文件以当前 Segment 的第一条消息的 Offset 命名。下图为 index 文件和 log 文件的结构示意图：

![图片](https://txxs.github.io/pic/q&a/WX20210705-111618@2-5x.png)

“.index” 文件存储大量的索引信息，“.log” 文件存储大量的数据，索引文件中的元数据指向对应数据文件中 Message 的物理偏移量。

> 这篇文章不错：https://mp.weixin.qq.com/s/LJslx5LhhxeLm_Ga_Xj3Ew

segment文件存储

- segment file组成：由2大部分组成，分别为index file和data file，此2个文件一一对应，成对出现，分别表示为segment索引文件、数据文件.
- segment文件命名规则：partion全局的第一个segment从0开始，后续每个segment文件名为上一个segment文件最后一条消息的offset值。数值最大为64位long大小，19位数字字符长度，没有数字用0填充。
- segment index file采取稀疏索引存储方式，它减少索引文件大小，通过mmap可以直接内存操作，稀疏索引为数据文件的每个对应message设置一个元数据指针,它比稠密索引节省了更多的存储空间，但查找起来需要消耗更多的时间。


### 四、生产者

#### 4.1 分区策略

分区原因：方便在集群中扩展，每个 Partition 可以通过调整以适应它所在的机器，而一个 Topic 又可以有多个 Partition 组成，因此可以以 Partition 为单位读写了。
可以提高并发，因此可以以 Partition 为单位读写了。

分区原则：我们需要将 Producer 发送的数据封装成一个 ProducerRecord 对象。该对象需要指定一些参数：

- topic：string 类型，NotNull。
- partition：int 类型，可选。
- timestamp：long 类型，可选。
- key：string 类型，可选。
- value：string 类型，可选。
- headers：array 类型，Nullable。

指明 Partition 的情况下，直接将给定的Value作为Partition的值。没有指明Partition但有Key的情况下，将Key的Hash值与分区数取余得到Partition值。既没有Partition有没有Key的情况下，第一次调用时随机生成一个整数（后面每次调用都在这个整数上自增），将这个值与可用的分区数取余，得到 Partition 值，也就是常说的 Round-Robin 轮询算法。

#### 4.2 数据可靠性保证

为保证 Producer 发送的数据，能可靠地发送到指定的 Topic，Topic 的每个 Partition 收到 Producer 发送的数据后，都需要向 Producer 发送 ACK（ACKnowledge 确认收到）。如果 Producer 收到 ACK，就会进行下一轮的发送，否则重新发送数据。

![图片](https://txxs.github.io/pic/q&a/WX20210705-111618@2-6x.png)

##### 4.2.1 副本数据同步策略

何时发送 ACK？确保有 Follower 与 Leader 同步完成，Leader 再发送 ACK，这样才能保证 Leader 挂掉之后，能在 Follower 中选举出新的 Leader 而不丢数据。多少个 Follower 同步完成后发送 ACK？全部 Follower 同步完成，再发送 ACK。

![图片](https://txxs.github.io/pic/q&a/WX20210705-111618@2-7x.png)

##### 4.2.2 ISR

采用第二种方案，所有 Follower 完成同步，Producer 才能继续发送数据，设想有一个 Follower 因为某种原因出现故障，那 Leader 就要一直等到它完成同步。这个问题怎么解决？Leader维护了一个动态的 in-sync replica set（ISR）：和 Leader 保持同步的 Follower 集合。当 ISR 集合中的 Follower 完成数据的同步之后，Leader 就会给 Follower 发送 ACK。如果 Follower 长时间未向 Leader 同步数据，则该 Follower 将被踢出 ISR 集合，该时间阈值由 replica.lag.time.max.ms 参数设定。Leader 发生故障后，就会从 ISR 中选举出新的 Leader。

##### 4.2.3 ACK 应答机制

对于某些不太重要的数据，对数据的可靠性要求不是很高，能够容忍数据的少量丢失，所以没必要等 ISR 中的 Follower 全部接受成功。所以 Kafka 为用户提供了三种可靠性级别，用户根据可靠性和延迟的要求进行权衡，选择以下的配置。

![图片](https://txxs.github.io/pic/q&a/WX20210705-111618@2-8x.png)

ACK 参数配置：

- 0：Producer 不等待 Broker 的 ACK，这提供了最低延迟，Broker 一收到数据还没有写入磁盘就已经返回，当 Broker 故障时有可能丢失数据。
- 1：Producer 等待 Broker 的 ACK，Partition 的 Leader 落盘成功后返回 ACK，如果在 Follower 同步成功之前 Leader 故障，那么将会丢失数据。
- -1（all）：Producer 等待 Broker 的 ACK，Partition 的 Leader 和 Follower 全部落盘成功后才返回 ACK。但是在 Broker 发送 ACK 时，Leader 发生故障，则会造成数据重复。

##### 4.2.4 故障处理细节

![图片](https://txxs.github.io/pic/q&a/WX20210705-111618@2-9x.png)

LEO：每个副本最大的 Offset。HW：消费者能见到的最大的 Offset，ISR 队列中最小的 LEO。

- Follower 故障：Follower 发生故障后会被临时踢出 ISR 集合，待该 Follower 恢复后，Follower 会 读取本地磁盘记录的上次的 HW，并将 log 文件高于 HW 的部分截取掉，从 HW 开始向 Leader 进行同步数据操作。等该 Follower 的 LEO 大于等于该 Partition 的 HW，即 Follower 追上 Leader 后，就可以重新加入 ISR 了。

- Leader故障：Leader发生故障后，会从ISR中选出一个新的Leader，之后，为保证多个副本之间的数据一致性，其余的Follower会先将各自的log文件高于HW的部分截掉，然后从新的Leader同步数据。注意：这只能保证副本之间的数据一致性，并不能保证数据不丢失或者不重复。

#### 4.3 Exactly Once 语义

将服务器的 ACK 级别设置为 -1，可以保证 Producer 到 Server 之间不会丢失数据，即 At Least Once 语义。相对的，将服务器 ACK 级别设置为 0，可以保证生产者每条消息只会被发送一次，即 At Most Once 语义。At Least Once 可以保证数据不丢失，但是不能保证数据不重复；相对的，At Most Once 可以保证数据不重复，但是不能保证数据不丢失。但是，对于一些非常重要的信息，比如交易数据，下游数据消费者要求数据既不重复也不丢失，即 Exactly Once 语义。0.11 版本的 Kafka，引入了幂等性：Producer 不论向 Server 发送多少重复数据，Server 端都只会持久化一条。即：
```
At Least Once + 幂等性 = Exactly Once   
```

要启用幂等性，只需要将 Producer 的参数中 enable.idompotence 设置为 true 即可。开启幂等性的 Producer 在初始化时会被分配一个 PID，发往同一 Partition 的消息会附带 Sequence Number。而 Borker 端会对 <PID,Partition,SeqNumber> 做缓存，当具有相同主键的消息提交时，Broker 只会持久化一条。**但是 PID 重启后就会变化，同时不同的 Partition 也具有不同主键，所以幂等性无法保证跨分区会话的 Exactly Once。**

- 如果消息序号比Broker维护的序号差值比一大，说明中间有数据尚未写入，即乱序，此时Broker拒绝该消息，Producer抛出InvalidSequenceNumber
- 如果消息序号小于等于Broker维护的序号，说明该消息已被保存，即为重复消息，Broker直接丢弃该消息，Producer抛出DuplicateSequenceNumber
- Sender发送失败后会重试，这样可以保证每个消息都被发送到broker

写入的过程可以总结为：

- Producer先从Zookeeper的"/brokers/.../state"节点找到该Partition的Leader。
- Producer将消息发送给该Leader。
- Leader将消息写入本地log。
- followers从Leader pull消息，写入本地log后Leader发送ACK。
- Leader收到所有ISR中的replica的ACK后，增加HW并向Producer发送ACK。

发送消息的三种方式：

- 异步发送：Kafka 自从 0.8.2 版本就引入了新版本 Producer API，新版 Producer 完全是采用异步方式发送消息。生产端构建的 ProducerRecord 先是经过 keySerializer、valueSerializer 序列化后，再是经过 Partition 分区器处理，决定消息落到 topic 具体某个分区中，最后把消息发送到客户端的消息缓冲池 accumulator 中，交由一个叫作 Sender 的线程发送到 broker 端。这里缓冲池 accumulator 的最大大小由参数 buffer.memory 控制，默认是 32M，当生产消息的速度过快导致 buffer 满了的时候，将阻塞 max.block.ms 时间，超时抛异常，所以 buffer 的大小可以根据实际的业务情况进行适当调整。

- 批量发送：发送到缓冲 buffer 中消息将会被分为一个一个的 batch，分批次的发送到 broker 端，批次大小由参数 batch.size 控制，默认16KB。这就意味着正常情况下消息会攒够 16KB 时才会批量发送到 broker 端，所以一般减小 batch 大小有利于降低消息延时，增加 batch 大小有利于提升吞吐量。那么生成端消息是不是必须要达到一个 batch 大小时，才会批量发送到服务端呢？答案是否定的，Kafka 生产端提供了另一个重要参数 linger.ms，该参数控制了 batch 最大的空闲时间，超过该时间的 batch 也会被发送到 broker 端。

- 消息重试：此外，Kafka 生产端支持重试机制，对于某些原因导致消息发送失败的，比如网络抖动，开启重试后 Producer 会尝试再次发送消息。该功能由参数 retries控制，参数含义代表重试次数，默认值为0表示不重试，建议设置大于0比如3。


### 五、消费者

Kafka集群保持所有的消息，直到它们过期（无论消息是否被消费）。实际上消费者所持有的仅有的元数据就是这个offset（偏移量），也就是说offset由消费者来控制：正常情况当消费者消费消息的时候，偏移量也线性的的增加。但是实际偏移量由消费者控制，消费者可以将偏移量重置为更早的位置，重新读取消息。可以看到这种设计对消费者来说操作自如，一个消费者的操作不会影响其它消费者对此log的处理。

#### 5.1 消费方式

- Consumer 采用 Pull（拉取）模式从 Broker 中读取数据： Pull 模式则可以根据 Consumer 的消费能力以适当的速率消费消息。Pull 模式不足之处是，如果 Kafka 没有数据，消费者可能会陷入循环中，一直返回空数据。因为消费者从 Broker 主动拉取数据，需要维护一个长轮询，针对这一点， Kafka 的消费者在消费数据时会传入一个时长参数 timeout。如果当前没有数据可供消费，Consumer 会等待一段时间之后再返回，这段时长即为 timeout。
- Consumer 采用 Push（推送）模式，Broker 给 Consumer 推送消息的速率是由 Broker 决定的，很难适应消费速率不同的消费者：它的目标是尽可能以最快速度传递消息，但是这样很容易造成 Consumer 来不及处理消息，典型的表现就是拒绝服务以及网络拥塞。

#### 5.2 分区分配策略

一个 Consumer Group 中有多个 Consumer，一个 Topic 有多个 Partition，所以必然会涉及到 Partition 的分配问题，即确定哪个 Partition 由哪个 Consumer 来消费。Kafka 有两种分配策略，一个是 RoundRobin，一个是 Range，默认为Range，当消费者组内消费者发生变化时，会触发分区分配策略（方法重新分配）。

##### 5.2.1 RoundRobin

RoundRobin 轮询方式将分区所有作为一个整体进行 Hash 排序，消费者组内分配分区个数最大差别为 1，是按照组来分的，可以解决多个消费者消费数据不均衡的问题。但是，当消费者组内订阅不同主题时，可能造成消费混乱，如下图所示，Consumer0 订阅主题 A，Consumer1 订阅主题 B。

![图片](https://txxs.github.io/pic/q&a/WX20210705-111618@2-10x.png)

将 A、B 主题的分区排序后分配给消费者组，TopicB 分区中的数据可能分配到 Consumer0 中。

##### 5.2.2 Range

![图片](https://txxs.github.io/pic/q&a/WX20210705-111618@2-11x.png)

Range 方式是按照主题来分的，不会产生轮询方式的消费混乱问题。但是，如下图所示，Consumer0、Consumer1 同时订阅了主题 A 和 B，可能造成消息分配不对等问题，当消费者组内订阅的主题越多，分区分配可能越不均衡。

![图片](https://txxs.github.io/pic/q&a/WX20210705-111618@2-12x.png)

#### 5.3 Offset 的维护

由于 Consumer 在消费过程中可能会出现断电宕机等故障，Consumer 恢复后，需要从故障前的位置继续消费。所以 Consumer 需要实时记录自己消费到了哪个 Offset，以便故障恢复后继续消费。Kafka 0.9 版本之前，Consumer 默认将 Offset 保存在 Zookeeper 中，从 0.9 版本开始，Consumer 默认将 Offset 保存在 Kafka 一个内置的 Topic 中，该 Topic 为 __consumer_offsets。

> 引用自：https://zhuanlan.zhihu.com/p/378335029

> 这篇感觉还行：https://mp.weixin.qq.com/s?__biz=MzIxMjAzMDA1MQ==&mid=2648945468&idx=1&sn=b622788361b384e152080b60e5ea69a7#rd

### 六、性能优化

从高度抽象的角度来看，性能问题逃不出下面三个方面：网络；磁盘；复杂度。对于Kafka这种网络分布式队列来说，网络和磁盘更是优化的重中之重。针对于上面提出的抽象问题，解决方案高度抽象出来也很简单：并发；压缩；批量；缓存；算法。知道了问题和思路，我们再来看看，在 Kafka 中，有哪些角色，而这些角色就是可以优化的点：Producer；Broker；Consumer。

#### 6.1 顺序写入

***完成一次磁盘 IO，需要经过寻道、旋转和数据传输三个步骤***。影响磁盘 IO 性能的因素也就发生在上面三个步骤上，因此主要花费的时间就是：

- 寻道时间：Tseek 是指将读写磁头移动至正确的磁道上所需要的时间。寻道时间越短，I/O 操作越快，目前磁盘的平均寻道时间一般在 3-15ms。
- 旋转延迟：Trotation 是指盘片旋转将请求数据所在的扇区移动到读写磁盘下方所需要的时间。旋转延迟取决于磁盘转速，通常用磁盘旋转一周所需时间的 1/2 表示。比如：7200rpm 的磁盘平均旋转延迟大约为 60*1000/7200/2 = 4.17ms，而转速为 15000rpm 的磁盘其平均旋转延迟为 2ms。
- 数据传输时间：Ttransfer 是指完成传输所请求的数据所需要的时间，它取决于数据传输率，其值等于数据大小除以数据传输率。目前 IDE/ATA 能达到 133MB/s，SATA II可达到 300MB/s的接口数据传输率，数据传输时间通常远小于前两部分消耗时间。简单计算时可忽略。

因此，如果在写磁盘的时候省去寻道、旋转可以极大地提高磁盘读写的性能。***Kafka 采用顺序写文件的方式来提高磁盘写入性能***。顺序写文件，基本减少了磁盘寻道和旋转的次数。磁头再也不用在磁道上乱舞了，而是一路向前飞速前行。Kafka 中每个分区是一个有序的，不可变的消息序列，新的消息不断追加到 Partition 的末尾，在 Kafka 中 Partition 只是一个逻辑概念，Kafka 将 Partition 划分为多个 Segment，每个 Segment 对应一个物理文件，Kafka 对 segment 文件追加写，这就是顺序写文件。

为什么 Kafka 可以使用追加写的方式呢？

这和 Kafka 的性质有关，我们来看看 Kafka 和 Redis，说白了，Kafka 就是一个Queue，而 Redis 就是一个HashMap。Queue和Map的区别是什么？Queue是 FIFO 的，数据是有序的；HashMap数据是无序的，是随机读写的。Kafka 的不可变性，有序性使得 Kafka 可以使用追加写的方式写文件。其实很多符合以上特性的数据系统，都可以采用追加写的方式来优化磁盘性能。典型的有Redis的 AOF 文件，各种数据库的WAL(Write ahead log)机制等等。

#### 6.2 零拷贝

> 具体什么是零拷贝参考：https://www.cnblogs.com/xiaolincoding/p/13719610.html，https://blog.csdn.net/qq_36654629/article/details/112629783

什么是零拷贝？我们从 Kafka 的场景来看，Kafka Consumer 消费存储在 Broker 磁盘的数据，从读取 Broker 磁盘到网络传输给 Consumer，期间涉及哪些系统交互。Kafka Consumer 从 Broker 消费数据，Broker 读取 Log，就使用了 sendfile。如果使用传统的 IO 模型，伪代码逻辑就如下所示：
```
readFile(buffer)
send(buffer)
```

如果采用传统的 IO 流程，先读取网络 IO，再写入磁盘 IO，实际需要将数据 Copy 四次。

- 第一次：读取磁盘文件到操作系统内核缓冲区；
- 第二次：将内核缓冲区的数据，copy 到应用程序的 buffer；
- 第三步：将应用程序 buffer 中的数据，copy 到 socket 网络发送缓冲区；
- 第四次：将 socket buffer 的数据，copy 到网卡，由网卡进行网络传输。

操作系统的设计就是每个应用程序都有自己的用户内存，用户内存和内核内存隔离，这是为了程序和系统安全考虑，否则的话每个应用程序内存满天飞，随意读写那还得了。不过，还有零拷贝技术，英文——Zero-Copy。零拷贝就是尽量去减少上面数据的拷贝次数，从而减少拷贝的 CPU 开销，减少用户态内核态的上下文切换次数，从而优化数据传输的性能。

常见的零拷贝思路主要有二种：

- mmap + write
- sendfile

mmap + write：在前面我们知道，read()系统调用的过程中会把内核缓冲区的数据拷贝到用户的缓冲区里，于是为了减少这一步开销，我们可以用mmap()替换read()系统调用函数。mmap()系统调用函数会直接把内核缓冲区里的数据「映射」到用户空间，这样，操作系统内核与用户空间就不需要再进行任何的数据拷贝操作。具体过程如下：

- 应用进程调用了 mmap() 后，DMA（直接内存访问） 会把磁盘的数据拷贝到内核的缓冲区里。接着，应用进程跟操作系统内核「共享」这个缓冲区；
- 应用进程再调用 write()，操作系统直接将内核缓冲区的数据拷贝到 socket 缓冲区中，这一切都发生在内核态，由 CPU 来搬运数据；
- 最后，把内核的 socket 缓冲区里的数据，拷贝到网卡的缓冲区里，这个过程是由 DMA 搬运的。

我们可以得知，通过使用 mmap() 来代替 read()， 可以减少一次数据拷贝的过程。但这还不是最理想的零拷贝，因为仍然需要通过 CPU 把内核缓冲区的数据拷贝到 socket 缓冲区里，而且仍然需要 4 次上下文切换，因为系统调用还是 2 次。

sendfile：在Linux内核版本2.1中，提供了一个专门发送文件的系统调用函数sendfile()，首先，它可以替代前面的read()和write()这两个系统调用，这样就可以减少一次系统调用，也就减少了2次上下文切换的开销。其次，该系统调用，可以直接把内核缓冲区里的数据拷贝到 socket 缓冲区里，不再拷贝到用户态，这样就只有2次上下文切换，和3次数据拷贝。从 Linux 内核 2.4 版本开始起，对于支持网卡支持 SG-DMA 技术的情况下， sendfile() 系统调用的过程发生了点变化，具体过程如下：

- 第一步，通过 DMA 将磁盘上的数据拷贝到内核缓冲区里；
- 第二步，缓冲区描述符和数据长度传到 socket 缓冲区，这样网卡的 SG-DMA 控制器就可以直接将内核缓存中的数据拷贝到网卡的缓冲区里，此过程不需要将数据从操作系统内核缓冲区拷贝到 socket 缓冲区中，这样就减少了一次数据拷贝；

这就是所谓的零拷贝（Zero-copy）技术，因为我们没有在内存层面去拷贝数据，也就是说全程没有通过 CPU 来搬运数据，所有的数据都是通过 DMA 来进行传输的。。零拷贝技术的文件传输方式相比传统文件传输的方式，减少了 2 次上下文切换和数据拷贝次数，只需要 2 次上下文切换和数据拷贝次数，就可以完成文件的传输，而且 2 次的数据拷贝过程，都不需要通过 CPU，2 次都是由 DMA 来搬运。所以，总体来看，零拷贝技术可以把文件传输的性能提高至少一倍以上。

Kafka 使用到了mmap和sendfile的方式来实现零拷贝。分别对应 Java的MappedByteBuffer和FileChannel.transferTo。在此模型下，上下文切换的数量减少到一个。具体而言，transferTo()方法指示块设备通过DMA引擎将数据读取到读取缓冲区中。然后，将该缓冲区复制到另一个内核缓冲区以暂存到套接字。最后，套接字缓冲区通过 DMA 复制到 NIC缓冲区。**我们将副本数从四减少到三，并且这些副本中只有一个涉及CPU。我们还将上下文切换的数量从四个减少到了两个**。这是一个很大的改进，但是还没有查询零副本。当运行 Linux 内核 2.4 及更高版本以及支持收集操作的网络接口卡时，后者可以作为进一步的优化来实现。

根据前面的示例，调用transferTo()方法会使设备通过 DMA 引擎将数据读取到内核读取缓冲区中。但是，使用gather操作时，读取缓冲区和套接字缓冲区之间没有复制。取而代之的是，给 NIC 一个指向读取缓冲区的指针以及偏移量和长度，该偏移量和长度由 DMA 清除。CPU 绝对不参与复制缓冲区。

producer 生产消息到 Broker 时，Broker 会使用 pwrite() 系统调用【对应到 Java NIO 的 FileChannel.write() API】按偏移量写入数据，此时数据都会先写入page cache。consumer 消费消息时，Broker 使用 sendfile() 系统调用【对应 FileChannel.transferTo() API】，零拷贝地将数据从 page cache 传输到 broker 的 Socket buffer，再通过网络传输。leader 与 follower 之间的同步，与上面 consumer 消费数据的过程是同理的。page cache中的数据会随着内核中 flusher 线程的调度以及对 sync()/fsync() 的调用写回到磁盘，就算进程崩溃，也不用担心数据丢失。另外，如果 consumer 要消费的消息不在page cache里，才会去磁盘读取，并且会顺便预读出一些相邻的块放入 page cache，以方便下一次读取。因此如果 Kafka producer 的生产速率与 consumer 的消费速率相差不大，那么就能几乎只靠对 broker page cache 的读写完成整个生产 - 消费过程，磁盘访问非常少。

#### 6.3 网络模型

Kafka 自己实现了网络模型做 RPC。底层基于 Java NIO，采用和 Netty 一样的 Reactor 线程模型。Reacotr 模型主要分为三个角色

- Reactor：把 IO 事件分配给对应的 handler 处理
- Acceptor：处理客户端连接事件
- Handler：处理非阻塞的任务

在传统阻塞 IO 模型中，每个连接都需要独立线程处理，当并发数大时，创建线程数多，占用资源；采用阻塞 IO 模型，连接建立后，若当前线程没有数据可读，线程会阻塞在读操作上，造成资源浪费。针对传统阻塞 IO 模型的两个问题，Reactor 模型基于池化思想，避免为每个连接创建线程，连接完成后将业务处理交给线程池处理；基于 IO 复用模型，多个连接共用同一个阻塞对象，不用等待所有的连接。遍历到有新数据可以处理时，操作系统会通知程序，线程跳出阻塞状态，进行业务逻辑处理。

Kafka 即基于 Reactor 模型实现了多路复用和处理线程池。其设计如下：其中包含了一个Acceptor线程，用于处理新的连接，Acceptor有 N 个Processor线程 select 和 read socket 请求，N 个Handler线程处理请求并相应，即处理业务逻辑。I/O 多路复用可以通过把多个 I/O 的阻塞复用到同一个 select 的阻塞上，从而使得系统在单线程的情况下可以同时处理多个客户端请求。它的最大优势是系统开销小，并且不需要创建新的进程或者线程，降低了系统的资源开销。

#### 6.4 批量与压缩

Kafka Producer 向 Broker 发送消息不是一条消息一条消息的发送。使用过 Kafka 的同学应该知道，Producer 有两个重要的参数：batch.size和linger.ms。这两个参数就和 Producer 的批量发送有关。发送消息依次经过以下处理器：

- Serialize：键和值都根据传递的序列化器进行序列化。优秀的序列化方式可以提高网络传输的效率。
- Partition：决定将消息写入主题的哪个分区，默认情况下遵循 murmur2 算法。自定义分区程序也可以传递给生产者，以控制应将消息写入哪个分区。
- Compress：默认情况下，在 Kafka 生产者中不启用压缩.Compression 不仅可以更快地从生产者传输到代理，还可以在复制过程中进行更快的传输。压缩有助于提高吞吐量，降低延迟并提高磁盘利用率。
- Accumulate：Accumulate顾名思义，就是一个消息累计器。其内部为每个 Partition 维护一个Deque双端队列，队列保存将要发送的批次数据，Accumulate将数据累计到一定数量，或者在一定过期时间内，便将数据以批次的方式发送出去。记录被累积在主题每个分区的缓冲区中。根据生产者批次大小属性将记录分组。主题中的每个分区都有一个单独的累加器 / 缓冲区。
- Group Send：记录累积器中分区的批次按将它们发送到的代理分组。批处理中的记录基于 batch.size 和 linger.ms 属性发送到代理。记录由生产者根据两个条件发送。当达到定义的批次大小或达到定义的延迟时间时。
- Kafka 支持多种压缩算法：lz4、snappy、gzip。Kafka 2.1.0 正式支持 ZStandard —— ZStandard 是 Facebook 开源的压缩算法，旨在提供超高的压缩比 (compression ratio)，具体细节参见 zstd。

Producer、Broker 和 Consumer 使用相同的压缩算法，在 producer 向 Broker 写入数据，Consumer 向 Broker 读取数据时甚至可以不用解压缩，最终在 Consumer Poll 到消息时才解压，这样节省了大量的网络和磁盘开销。

#### 6.5 分区并发

Kafka 的 Topic 可以分成多个 Partition，每个 Paritition 类似于一个队列，保证数据有序。同一个 Group 下的不同 Consumer 并发消费 Paritition，分区实际上是调优 Kafka 并行度的最小单元，因此，可以说，每增加一个 Paritition 就增加了一个消费并发。Kafka 具有优秀的分区分配算法——StickyAssignor，可以保证分区的分配尽量地均衡，且每一次重分配的结果尽量与上一次分配结果保持一致。这样，整个集群的分区尽量地均衡，各个 Broker 和 Consumer 的处理不至于出现太大的倾斜。

越多的分区需要打开更多的文件句柄：在 kafka 的 broker 中，每个分区都会对照着文件系统的一个目录。在 kafka 的数据日志文件目录中，每个日志数据段都会分配两个文件，一个索引文件和一个数据文件。因此，随着 partition 的增多，需要的文件句柄数急剧增加，必要时需要调整操作系统允许打开的文件句柄数。

客户端/服务器端需要使用的内存就越多：客户端producer有个参数batch.size，默认是16KB。它会为每个分区缓存消息，一旦满了就打包将消息批量发出。看上去这是个能够提升性能的设计。不过很显然，因为这个参数是分区级别的，如果分区数越多，这部分缓存所需的内存占用也会更多。

降低高可用性：分区越多，每个 Broker 上分配的分区也就越多，当一个发生 Broker 宕机，那么恢复时间将很长。

#### 6.6 文件结构

Kafka 消息是以 Topic 为单位进行归类，各个 Topic 之间是彼此独立的，互不影响。每个 Topic 又可以分为一个或多个分区。每个分区各自存在一个记录消息数据的日志文件。Kafka 每个分区日志在物理上实际按大小被分成多个 Segment。

- segment file 组成：由 2 大部分组成，分别为 index file 和 data file，此 2 个文件一一对应，成对出现，后缀”.index”和“.log”分别表示为 segment 索引文件、数据文件。
- segment 文件命名规则：partion 全局的第一个 segment 从 0 开始，后续每个 segment 文件名为上一个 segment 文件最后一条消息的 offset 值。数值最大为 64 位 long 大小，19 位数字字符长度，没有数字用 0 填充。
  index 采用稀疏索引，这样每个 index 文件大小有限，Kafka 采用mmap的方式，直接将 index 文件映射到内存，这样对 index 的操作就不需要操作磁盘 IO。mmap的 Java 实现对应MappedByteBuffer。

mmap(除了标准的文件 IO，例如 open, read, write，内核还提供接口允许应用将文件 map 到内存。使得内存中的一个字节与文件中的一个字节一一对应。)是一种内存映射文件的方法。即将一个文件或者其它对象映射到进程的地址空间，实现文件磁盘地址和进程虚拟地址空间中一段虚拟地址的一一对映关系。实现这样的映射关系后，进程就可以采用指针的方式读写操作这一段内存，而系统会自动回写脏页面到对应的文件磁盘上，即完成了对文件的操作而不必再调用 read,write 等系统调用函数。相反，内核空间对这段区域的修改也直接反映用户空间，从而可以实现不同进程间的文件共享。

mmap：还可以参考：https://www.jianshu.com/p/187eada7b900，https://www.cnblogs.com/huxiao-tee/p/4660352.html

Kafka 充分利用二分法来查找对应 offset 的消息位置：

- 按照二分法找到小于 offset 的 segment 的.log 和.index
- 用目标 offset 减去文件名中的 offset 得到消息在这个 segment 中的偏移量。
- 再次用二分法在 index 文件中找到对应的索引。
- 到 log 文件中，顺序查找，直到找到 offset 对应的消息。

> 引用自：https://mp.weixin.qq.com/s/AqPxQ2232yuiAT0sYX9RMA

#### 6.7 Page Cache

为了优化读写性能，Kafka使用操作系统缓存——Page Cache，而不是JVM空间内存。这样做的优势：避免Broker内存消耗。如果使用Java堆，Java对象的内存消耗会比较大；操作系统层面的缓存利用率会更高，因为存储的都是紧凑的字节结构而不是独立的对象。避免GC问题。随着JVM中数据不断增多，垃圾回收将会变得复杂与缓慢，使用Page Cache就不会存在GC问题。应用重启，系统缓存不会消失。通过操作系统的Page Cache，Kafka的读写操作基本上是基于内存的，读写速度得到了极大的提升。Page Cache配合mmap技术(直接内存映射)，实现了用户态和内核态对指定内存区域的共享。



总结一下Kafka性能优化就是从以下几个点：

- 零拷贝网络和磁盘
- 优秀的网络模型，基于 Java NIO
- 高效的文件数据结构设计
- Parition 并行和可扩展
- 数据批量传输
- 数据压缩
- 顺序读写磁盘
- 无锁轻量级 offset

### 七、高可用

实现高可用性的方式一般都是进行replication，对于kafka，如果没有提供HighAvailablity机制，一旦一个或多个Broker宕机，则宕机期间其上所有Partition都无法继续提供服务。若该Broker永远不能再恢复，那么所有的数据也就将丢失，这是不可容忍的。所以kafka高可用性的设计也是进行Replication。

#### 7.1 Replica如何同步

当没有Replica的时候，producer向broker写入消息非常简单，当有很多Replica的时候是如何处理的呢？一般来说，对于这种情况有两个处理方法

- 同步复制，当producer向所有的Replica写入成功消息后才返回。一致性得到保障，但是延迟太高，吞吐率降低。
- 异步复制，所有的Replica选取一个一个leader，producer向leader写入成功即返回，leader负责将消息同步给其他的所有Replica。但是消息同步一致性得不到保证，但是保证了快速的响应。

而kafka选取了一个折中的方式：ISR（in-syncreplicas）。producer每次发送消息，将消息发送给leader，leader将消息同步给他“信任”的“小弟们”就算成功，巧妙的均衡了确保数据不丢失以及吞吐率。具体的，在所有的Replica中，leader会维护一个与其基本保持同步的Replica列表，该列表称为ISR(in-sync Replica)，每个Partition都会有一个ISR，而且是由leader动态维护。如果一个replica落后leader太多，leader会将其剔除。如果另外的replica跟上脚步，leader会将其加入。
- 同步：leader向ISR中的所有replica同步消息，当收到所有ISR中replica的ack之后，leader才commit。
- 异步：收到同步消息的ISR中的replica，异步将消息同步给ISR集合外的replica。

具体来看：

假设某个分区的ISR集合中有3个副本，即一个Leader副本和2个Follower副本，此时分区的LEO和HW都为3。消息3和消息4从生产者发出之后会被先存入Leader副本。在消息写入Leader副本之后，Follower副本会发送拉取请求来拉取消息3和消息4以进行消息同步。在同步过程中，不同的Follower副本的同步效率也不尽相同。在某一时刻Follower1完全跟上了Leader副本而Follower2只同步了消息3，如此Leader副本的LEO为5，Follower1的LEO为5，Follower2的LEO为4，那么当前分区的HW取最小值4，此时消费者可以消费到offset为0至3之间的消息。当所有的副本都成功写入了消息3和消息4，整个分区的HW和LEO都变为5，因此消费者可以消费到offset为4的消息了。




#### 7.2 如何Leader Election

了解了Kafka如何做Replication，随之而来的疑问便是如何选取leader？leader选举可谓是一个经典问题，立马想到了paxos，raft、Zab等算法，然而kafka采用的方法相比就简单很多：Kafka的Leader选举是通过在zookeeper上创建/controller临时节点来实现leader选举，并在该节点中写入当前broker的元信息。一个节点只能被一个客户端创建成功，创建成功的broker即为leader，即先到先得原则。当leader和zookeeper失去连接时，临时节点会删除，而其他broker会监听该节点的变化，当节点删除时，其他broker会收到事件通知，重新发起leader选举。

> 引用自：https://mp.weixin.qq.com/s/Y5JmVr7xRpi8QygGTWQ5vg

> 这个也不错：https://mp.weixin.qq.com/s/geR3pDw_Yjhmu8KMsXQosg

#### 7.3 Kafka和ZK的关系

![图片](https://txxs.github.io/pic/q&a/WX20210705-111618@2-13x.png)

##### 7.3.1 注册中心

- broker注册：**broker分布式部署，就需要一个注册中心来进行统一管理**。Zookeeper用一个专门节点保存Broker服务列表，也就是 /brokers/ids。broker启动时，向Zookeeper发送注册请求，Zookeeper会在/brokers/ids下创建这个broker节点，如/brokers/ids/[0...N]，并保存broker的IP地址和端口。**这个节点临时节点，一旦broker宕机，这个临时节点会被自动删除**。

- topic注册：Zookeeper也会为topic分配一个单独节点，每个topic都会以/brokers/topics/[topic_name]的形式记录在Zookeeper。一个topic的消息会被保存到多个partition，这些partition跟broker的对应关系也需要保存到Zookeeper。partition是多副本保存的，上图中红色partition是leader副本。当leader副本所在的broker发生故障时，partition需要重新选举leader，这个需要由Zookeeper类主导完成。broker启动后，会把自己的BrokerID注册到到对应topic节点的分区列表中。当broker退出后，Zookeeper会更新其对应topic的分区列表。我们查看一个topic是xxx，分区编号是1的信息，命令如下：
```
[root@master] get /brokers/topics/xxx/partitions/1/state
{"controller_epoch":15,"leader":11,"version":1,"leader_epoch":2,"isr":[11,12,13]}
```
- consumer注册:消费者组也会向Zookeeper进行注册，Zookeeper会为其分配节点来保存相关数据，节点路径为/consumers/{group_id}，有3个子节点，如下图:图片这样Zookeeper可以记录分区跟消费者的关系，以及分区的offset。

##### 7.3.2 负载均衡

broker向Zookeeper进行注册后，生产者根据broker节点来感知broker服务列表变化，这样可以实现动态负载均衡。consumer group中的消费者，可以根据topic节点信息来拉取特定分区的消息,实现负载均衡。实际上，Kafka在Zookeeper中保存的元数据非常多，看下面这张图：图片随着 broker、topic 和 partition 增多，保存的数据量会越来越大。

##### 7.3.3。Controller介绍

经过上一节的讲述，我们看到了Kafka对Zookeeper的依赖非常大，Kafka离开Zookeeper是没有办法独立运行的。那Kafka是怎么跟Zookeeper进行交互的呢？**Kafka集群中会有一个broker被选举为Controller负责跟Zookeeper进行交互**。它负责管理整个Kafka集群中所有分区和副本的状态。其他broker监听Controller节点的数据变化。Controller的选举工作依赖于Zookeeper，选举成功后，Zookeeper会创建一个/controller临时节点。Controller具体职责如下：

- 监听分区变化：比如当某个分区的 leader 出现故障时，Controller 会为该分区选举新的 leader。
- 当检测到分区的 ISR 集合发生变化时，Controller 会通知所有 broker 更新元数据。
- 当某个 topic 增加分区时，Controller 会负责重新分配分区。
- 监听topic相关的变化
- 监听broker相关的变化
- 集群元数据管理

下面这张图展示了 Controller、Zookeeper 和 broker 的交互细节：图片Controller选举成功后，会从Zookeeper集群中拉取一份完整的元数据初始化ControllerContext，这些元数据缓存在Controller节点。

![图片](https://txxs.github.io/pic/q&a/WX20210705-111618@2-14x.png)

当集群发生变化时，比如增加topic分区，Controller不仅需要变更本地的缓存数据，还需要将这些变更信息同步到其他Broker。Controller监听到Zookeeper事件、定时任务事件和其他事件后，将这些事件按照先后顺序暂存到LinkedBlockingQueue中。由事件处理线程按顺序处理，这些处理多数需要跟Zookeeper交互，Controller则需要更新自己的元数据。

但Zookeeper带来以下的问题

- 使用了Zookeeper，部署Kafka的时候必须要部署两套系统，Kafka的开发和运维人员必须要具备Zookeeper的运维能力。
- Kafaka依赖一个单一Controller节点跟Zookeeper进行交互，如果这个Controller节点发生了故障，就需要从broker中选举新的Controller。分区数非常多时，这个过程非常耗时，而且这个过程中Kafka集群是不能工作的。Zookeeper作为分布式系统，本身就是遵循CP原则。不具备高可用的特性。
- 当分区数增加时，Zookeeper保存的元数据变多，Zookeeper集群压力变大，达到一定级别后，监听延迟增加，给Kafaka的工作带来了影响。

所以，Kafka 需要去 ZooKeeper 。所以没了 Zookeeper 之后的 Kafka 的怎样的？

没了 Zookeeper 的 Kafka 就把元数据存储到自己内部了，利用之前的Log存储机制来保存元数据。KIP-500用QuorumController代替之前的Controller，**Quorum中每个Controller节点都会保存所有元数据**，通过KRaft协议保证副本的一致性。这样即使Quorum Controller节点出故障了，新的Controller迁移也会非常快。官方介绍，升级之后，Kafka可以轻松支持百万级别的分区。Kafak 团队把通过 Raft 协议同步数据的方式 Kafka Raft Metadata mode,简称 KRaftKafka的用户体量非常大，在不停服的情况下升级是必要的。目前 Kafka2.8 版本已经在 4 月 19 号发布。Kafaka计划在3.0版本会兼容Zookeeper Controller和Quorum Controller，这样用户可以进行灰度测试。

### 八、Kafka事务

Kafka 过去一直保障到 At Least Once 语义，用户生产的消息不会丢失，但是可能发生重复。比如，broker 接收 Producer 消息后崩溃，但是没来得及向 Producer 返回 ack，而使 Producer 重试而导致消息重复。为了避免 Producer 到 Broker 端的消息重复，**Kafka 引进了 Idempotent Producer 特性，使每条消息携带 Producer ID 和递增的 sequence 实现去重，从而能够实现生产侧的 Exactly Once**。但是仅靠生产消息的 Exactly Once 语义仍不能满足 Kafka Stream 这种流式处理场景的需要。在流式处理场景中，大部分操作都属于从一个或者多个 Topic Partition 消费数据，经处理后写入另外的多个 Topic Partition，即 Consume-Transform-Produce 过程。这一过程涉及多轮读写操作，而系统随时可能崩溃，崩溃重试时不希望看到消息产生重复消费而导致处理结果不确定，会更希望有事务原子性，做到要么全成功，要么全没发生。简而言之，Kafka 事务能保证向多个 Topic Partition 的原子写入。至于 Consumer Group 的消费操作，在 Kafka 也是基于向内部 __consumer_offsets 这个 Topic 写入点位实现的 commit。因此，事务中的消费操作也可以视作向多个 Topic Partition 的原子写入之一。

#### 8.1 事务设计

按《Transactional Messaging in Kafka》中的介绍，在Kafka事务的实现方面存在一些设计约束：要使同一Topic做到同时支持事务性消息和普通的非事务性消息，并不影响非事务性消息的性能；要使事务性消息的性能尽可能接近普通非事务性消息的性能；尽量不增加客户端的复杂性；事务的实现大致上是一个两阶段提交过程

- 一是增加 Transaction ID
- 二是增加事务控制消息
- 三是增加一个 Transaction Coordinator 组件。

> 引用自：https://www.jianshu.com/p/64c93065473e

#### 8.2 事务特性

Kafka的事务特性本质上代表了三个功能：
- 原子写操作：Kafka的事务特性本质上是支持了Kafka跨分区和Topic的原子写操作。在同一个事务中的消息要么同时写入成功，要么同时写入失败。我们知道，Kafka中的Offset信息存储在一个名为_consumed_offsets的Topic中，因此read-process-write模式，除了向目标Topic写入消息，还会向_consumed_offsets中写入已经消费的Offsets数据。因此read-process-write本质上就是跨分区和Topic的原子写操作。Kafka的事务特性就是要确保跨分区的多个写操作的原子性。
- 拒绝僵尸实例（Zombie fencing）：Kafka事务特性通过transaction-id属性来解决僵尸实例问题。所有具有相同transaction-id的Producer都会被分配相同的pid，同时每一个Producer还会被分配一个递增的epoch。Kafka收到事务提交请求时，如果检查当前事务提交者的epoch不是最新的，那么就会拒绝该Producer的请求。从而达成拒绝僵尸实例的目标。
- 读事务消息：为了保证事务特性，Consumer如果设置了isolation.level=read_committed，那么它只会读取已经提交了的消息。在Producer成功提交事务后，Kafka会将所有该事务中的消息的TransactionMarker从uncommitted标记为committed状态，从而所有的Consumer都能够消费。

#### 8.3 事务原理

- 1. 查找Tranaction Corordinator：Producer向任意一个brokers发送 FindCoordinatorRequest请求来获取Transaction Coordinator的地址。
- 2. 初始化事务 initTransaction：Producer发送InitpidRequest给Transaction Coordinator，获取pid。Transaction Coordinator在Transaciton Log中记录这<TransactionId,pid>的映射关系。另外，它还会做两件事：恢复（Commit或Abort）之前的Producer未完成的事务；对PID对应的epoch进行递增，这样可以保证同一个app的不同实例对应的PID是一样，而epoch是不同的。
- 3. 开始事务beginTransaction：执行Producer的beginTransacion()，它的作用是Producer在本地记录下这个transaction的状态为开始状态。这个操作并没有通知Transaction Coordinator，因为Transaction Coordinator只有在Producer发送第一条消息后才认为事务已经开启。
- 4. read-process-write流程：一旦Producer开始发送消息，Transaction Coordinator会将该<Transaction, Topic, Partition>存于Transaction Log内，并将其状态置为BEGIN。另外，如果该<Topic, Partition>为该事务中第一个<Topic, Partition>，Transaction Coordinator还会启动对该事务的计时（每个事务都有自己的超时时间）。在注册<Transaction, Topic, Partition>到Transaction Log后，生产者发送数据，虽然没有还没有执行commit或者abort，但是此时消息已经保存到Broker上了。即使后面执行abort，消息也不会删除，只是更改状态字段标识消息为abort状态。
- 5. 事务提交或终结 commitTransaction/abortTransaction在Producer执行commitTransaction/abortTransaction时，Transaction Coordinator会执行一个两阶段提交：

    - 第一阶段，将Transaction Log内的该事务状态设置为PREPARE_COMMIT或PREPARE_ABORT
    - 第二阶段，将Transaction Marker写入该事务涉及到的所有消息（即将消息标记为committed或aborted）。这一步骤Transaction Coordinator会发送给当前事务涉及到的每个<Topic, Partition>的Leader，Broker收到该请求后，会将对应的Transaction Marker控制信息写入日志。
    - 一旦Transaction Marker写入完成，Transaction Coordinator会将最终的COMPLETE_COMMIT或COMPLETE_ABORT状态写入Transaction Log中以标明该事务结束。

> 不错的，引用自：https://www.qedev.com/bigdata/159207.html

#### 8.4 事务场景

- 1.最简单的需求是producer发的多条消息组成一个事务这些消息需要对consumer同时可见或者同时不可见 。
- 2.producer可能会给多个topic，多个partition发消息，这些消息也需要能放在一个事务里面，这就形成了一个典型的分布式事务。
- 3.kafka的应用场景经常是应用先消费一个topic，然后做处理再发到另一个topic，这个consume-transform-produce过程需要放到一个事务里面，比如在消息处理或者发送的过程中如果失败了，消费位点也不能提交。
- 4.producer或者producer所在的应用可能会挂掉，新的producer启动以后需要知道怎么处理之前未完成的事务 。
- 5.流式处理的拓扑可能会比较深，如果下游只有等上游消息事务提交以后才能读到，可能会导致rt非常长吞吐量也随之下降很多，所以需要实现read committed和read uncommitted两种事务隔离级别。


### 九、问题

1. 如果所有的replica都不工作了？两种方式：

- 等待ISR中任一个Replica恢复，并选取他为leader：等待时间较长，降低了可用性。若ISR中的所有Replica都无法恢复或者数据丢失，则改partition将永不可用。
- 选择第一个回复的Replica为新的leader，无论他是否在ISR中：所选leader可能并未包含已被之前leader commit的消息，因此会造成数据丢失；可用性较高。


2. Partion的有序性

消息的顺序性需要注意，一个 Topic 如果有多个Partition的话，那么从Topic这个层面来看，消息是无序的。但单独看Partition的话，Partition内部消息是有序的。所以，一个Partition内部消息有序，一个Topic跨Partition是无序的。如果强制要求 Topic 整体有序，就只能让 Topic 只有一个 Partition。

3. 如何通过 offset 找到 某一条消息呢？

- 首先会根据 offset 值去查找 Segment 中的 index 文件，因为 index 文件是以上个文件的最大 offset 偏移命名的所以可以通过二分法快速定位到索引文件。
- 找到索引文件后，索引文件中保存的是 offset 和对应的消息行在 log 日志中的存储行号，因为 Kafka 采用稀疏矩阵的方式来存储索引信息，并不是每一条索引都存储，所以这里只是查到文件中符合当前 offset 范围的索引。
- 拿到 当前查到的范围索引对应的行号之后再去对应的 log 文件中从 当前 Position 位置开始查找 offset 对应的消息，直到找到该 offset 为止。

> 引用自：https://mp.weixin.qq.com/s/CMPlIDl5RIIBVsvpKw_w9Q

介绍下.index文件，这里以文件00000000000003257573.index为例，首先我们可以通过以下命令查看该索引文件的内容，可以看到输出结构为<offset,position>，实际上索引文件中保存的并不是offset而是相对位移，比如第一条消息的相对位移则为0，格式化输出时加上了基准偏移量。<114,17413>表示该分片相对位移为114的消息，其位移为3257573+114，即3257687，position表示对应offset在.log文件的物理地址，通过.index索引文件则可以获取对应offset所在的物理地址。

索引采用稀疏索引的方式构建，并不保证分片中的每个消息都在索引文件有映射关系（.timeindex索引也是类似），主要是为了节省磁盘空间、内存空间，因为索引文件最终会映射到内存中。


4. 为什么要设计 Partition 和 Segment 的存储机制
   Partition 是对外名义上的数据存储，用户理解数据都是顺序存储到 Partition 中。那么实际在 Partition 内又多了一套不对用户可见的 Segment 机制是为什么呢？原因有两个：

- 一个就是上面提到的如果使用单个 Partition 来管理数据，顺序往 Partition 中累加写势必会造成单个 Partition 文件过大，查找和维护数据就变得非常困难。
- 另一个原因是Kafka消息记录不是一直堆堆堆，默认是有日志清除策略的。要么是日志超过设定的保存时间触发清理逻辑，要么就是 Topic 日志文件超过阈值触发清除逻辑，如果是一个大文件删除是要锁文件的这时候写操作就不能进行。因此设置分段存储对于清除策略来说也会变得更加简单，只需删除较早的日志块即可。

5. offset 保存

某个消费组消费 partition 需要保存 offset 记录当前消费位置，0.10 之前的版本是把 offset 保存到 zk 中，但是 zk 的写性能不是很好，Kafka 采用的方案是 consumer 每分钟上报一次，这样就造成了重复消费的可能。

0.10 版本之后 Kafka 就 offset 的保存从 zk 剥离，保存到一个名为 consumer_offsets 的 Topic 中。消息的 key 由 [groupid、topic、partition] 组成，value 是偏移量 offset。Topic 配置的清理策略是 compact。总是保留最新的 key，其余删掉。一般情况下，每个 key 的 offset 都是缓存在内存中，查询的时候不用遍历 Partition，如果没有缓存第一次就会遍历 Partition 建立缓存然后查询返回。

6. 消息的顺序性

Kafka的设计中多个分区的话无法保证全局的消息顺序。

- 如果一定要实现全局的消息顺序，只能单分区。
- 通过有key分组，同一个key的消息放入同一个分区，保证局部有序

7. Kafka Broker 是如何存储数据？

Kafka 使用消息日志（Log）来保存数据，一个日志就是磁盘上一个只能追加写（Append-only）消息的物理文件。因为只能追加写入，故避免了缓慢的随机 I/O 操作，改为性能较好的顺序 I/O 写操作，这也是实现 Kafka 高吞吐量特性的一个重要手段。不过如果你不停地向一个日志写入消息，最终也会耗尽所有的磁盘空间，因此 Kafka 必然要定期地删除消息以回收磁盘。怎么删除呢？简单来说就是通过日志段（Log Segment）机制。在 Kafka 底层，一个日志又近一步细分成多个日志段，消息被追加写到当前最新的日志段中，当写满了一个日志段后，Kafka会自动切分出一个新的日志段，并将老的日志段封存起来。Kafka在后台还有定时任务会定期地检查老的日志段是否能够被删除，从而实现回收磁盘空间的目的。

8. Kafka 与 RabbitMQ 如何选择使用哪个？

https://mp.weixin.qq.com/s/w1mtXzQjwjvB5wdYEA8RhQ

> 引用自：https://mp.weixin.qq.com/s/zxPz_aFEMrshApZQ727h4g

9. 什么时候发生rebalance？：

- 组订阅topic数变更
- topic partition数变更
- consumer成员变更
- consumer 加入群组或者离开群组的时候
- consumer被检测为崩溃的时候

10. Kafka进行订单表设计

https://mp.weixin.qq.com/s/Ok4M9p2hsLZGkMAd4y3BJg

> 引用自：https://mp.weixin.qq.com/s?__biz=MzUyNzgyNzAwNg==&mid=2247484251&idx=1&sn=92d6b50c5987f4f80316313db05b56ff&scene=21#wechat_redirect

11. HW高水位与LEO

HW是High Watermark的缩写，俗称高水位，它标识了一个特定的消息偏移量（Offset），消费者只能拉取到这个Offset之前的消息。它代表一个日志文件，这个日志文件中有9条消息，第一条消息的Offset（LogStartOffset）为0，最后一条消息的Offset为8，Offset为9的消息用虚线框表示，代表下一条待写入的消息。日志文件的HW为6，表示消费者只能拉取到Offset在0至5之间的消息，而Offset为6的消息对消费者而言是不可见的。LEO是Log End Offset的缩写，它标识当前日志文件中下一条待写入消息的Offset，图中Offset为9的位置即为当前日志文件的LEO，LEO的大小相当于当前日志分区中最后一条消息的Offset值加1。分区ISR集合中的每个副本都会维护自身的LEO，而ISR集合中最小的LEO即为分区的HW，对消费者而言只能消费HW之前的消息。

12. 关于读写分离

Kafka并不支持读写分区，生产消费端所有的读写请求都是由Replication Leader副本处理的，Replication Follower副本的主要工作就是从Leader副本处异步拉取消息，进行消息数据的同步，并不对外提供读写服务。Kafka之所以这样设计，主要是为了保证读写一致性，因为副本同步是一个异步的过程，如果当Follower副本还没完全和Leader同步时，从Follower副本读取数据可能会读不到最新的消息。

> 引用自：https://mp.weixin.qq.com/s/9fJchPJa_raHSkvo29bkEA

13. 我们总结如何避免消费组 Rebalance

- 合理配置 session.timeout.ms 和 heartbeat.interval.ms，建议 0.10.1 之前适当调大 session 超时时间尽量规避 Rebalance。session.timeout.ms 和 heartbeat.interval.ms，含义分别是组协调器认为消费组存活的期限，和消费者发送心跳的时间间隔，其中 heartbeat.interval.ms 默认值是3s
- 根据实际业务调整 max.poll.interval.ms，通常建议调大避免 Rebalance，但注意 0.10.1 版本之前没有该参数。max.poll.interval.ms，表示 Consumer 两次调用 poll 方法拉取数据的最大时间间隔，默认值 5min，对于那些忙于业务逻辑处理导致超过 max.poll.interval.ms 时间的消费者将会离开消费组，此时将发生一次 Rebalance。
- 监控消费端的 GC 情况，避免由于频繁 FullGC 导致线程长时间停顿引发 Rebalance。
