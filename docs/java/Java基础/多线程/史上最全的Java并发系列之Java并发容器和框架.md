# 前言
>文本已收录至我的GitHub仓库，欢迎Star：https://github.com/bin392328206/six-finger                             
> **种一棵树最好的时间是十年前，其次是现在**   
>我知道很多人不玩**qq**了,但是怀旧一下,欢迎加入六脉神剑Java菜鸟学习群，群聊号码：**549684836** 鼓励大家在技术的路上写博客
## 絮叨 
原理的东西，前面基本讲完了，接下来，讲讲用法吧，讲讲Java实现的并发的框架  
- [🔥史上最全的Java并发系列之并发编程的挑战](https://juejin.im/post/5dfb1ca26fb9a0160b63827f)  
- [🔥史上最全的Java并发系列之Java并发机制的底层实现原理](https://juejin.im/post/5dfb3a27e51d4558181d35b0)    
- [🔥史上最全的Java并发系列之Java内存模型](https://juejin.im/post/5dfc3dadf265da339b5001dd)  
- [🔥史上最全的Java并发系列之Java多线程（一）](https://juejin.im/post/5dfc9106518825126e63a711) 
- [🔥史上最全的Java并发系列之Java多线程（二）](https://juejin.im/post/5dfeeed6e51d45582248e4a5)   
- [🔥史上最全的Java并发系列之Java中的锁的使用和实现介绍（一）](https://juejin.im/post/5e002416e51d45583b43939d) 
 
- [🔥史上最全的Java并发系列之Java中的锁的使用和实现介绍（二）](https://juejin.im/post/5e0037a651882512670ee0b5)

## ConcurrentHashMap
这个呢，我在前面集合容器有讲到，链接在下面   
[🔥史上最全的Java容器集合之ConcurrentHashMap（源码解读）](https://juejin.im/post/5dee17adf265da33942a7798)  
大家有兴趣的去看看

## ConcureentLinkedQueue
在并发编程中，有时候需要使用线程安全的队列。   
如果要实现一个线程安全的队列有两种方式：
- 使用阻塞算法：使用阻塞算法的队列可以用一个锁（入队和出队用同一把锁）或两个锁（入队和出队用不同的锁）等方式来实现。
- 使用非阻塞算法：非阻塞的实现方式则可以使用循环CAS的方式来实现。

ConcurrentLinkedQueue是一个基于链接节点的无界线程安全队列，它采用FIFO的规则对节点进行排序，当我们添加一个元素的时候，它会添加到队列的尾部；当我们获取一个元素时，它会返回队列头部的元素。它采用了“wait-free”算法（即CAS算法）来实现，该算法在Michael&Scott算法上进行了一些修改。


![](https://user-gold-cdn.xitu.io/2019/12/23/16f317c1650e59db?w=682&h=338&f=png&s=99767)
ConcurrentLinkedQueue由head节点和tail节点组成，每个节点Node由节点元素item和指向下一个节点next的引用组成，节点与节点之间就是通过这个next关联起来，从而组成一张链表结构的队列。


### 入队列
入队列就是将入队节点添加到队列的尾部。

![](https://user-gold-cdn.xitu.io/2019/12/23/16f317ff005fa280?w=702&h=395&f=png&s=106030)
- 添加元素1：队列更新head节点的next节点为元素1节点。又因为tail节点默认情况下等于head节点，所以它们的next节点都指向元素1节点。
- 添加元素2：队列首先设置元素1节点的next节点为元素2节点，然后更新tail节点指向元素2节点。
- 添加元素3：设置tail节点的next节点为元素3节点。
- 添加元素4：设置元素3的next节点为元素4节点，然后将tail节点指向元素4节点。

通过上图我们发现，入队主要做两件事情：

- 将入队节点设置成当前队列尾节点的下一个节点
- 更新tail节点，如果tail节点的next节点不为空，则将入队节点设置成tail节点，如果tail节点的next节点为空，则将入队节点设置成tail的next节点，所以tail节点不总是尾节点
- 以下是入队列的源码：

```
public boolean add(E e) {
    return offer(e);
}
public boolean offer(E e) {
    final Node<E> newNode = newNode(Objects.requireNonNull(e));
    for (Node<E> t = tail, p = t;;) {
        Node<E> q = p.next;
        if (q == null) {
            // p is last node
            if (casNext(p, null, newNode)) {
                if (p != t) // hop two nodes at a time
                    casTail(t, newNode);  // Failure is OK.
                return true;
            }
        }
        else if (p == q)
            p = (t != (t = tail)) ? t : head;
        else
            // Check for tail updates after two hops.
            p = (p != t && t != (t = tail)) ? t : q;
    }
}
```
- 构建了一个新的节点newNode
- 如果tail节点的next节点为空，则通过CAS将newNode设置为tail的next节点，设置成功之后，在更新tail为newNode节点。
- 否则继续重试上一步
### 出队列

出队列的就是从队列里返回一个节点元素，并清空该节点对元素的引用

![](https://user-gold-cdn.xitu.io/2019/12/23/16f3183d1d9144fa?w=671&h=441&f=png&s=108023)

以下是出队列的源码：

```
public E poll() {
    restartFromHead:
    for (;;) {
        for (Node<E> h = head, p = h, q;;) {
            E item = p.item;
            if (item != null && casItem(p, item, null)) {
                if (p != h) // hop two nodes at a time
                    updateHead(h, ((q = p.next) != null) ? q : p);
                return item;
            }
            else if ((q = p.next) == null) {
                updateHead(h, p);
                return null;
            }
            else if (p == q)
                continue restartFromHead;
            else
                p = q;
        }
    }
}
```
首先获取head节点的元素item，然后判断是否为空？
- 如果为空，表示另外一个线程已经进行了一次出队操作将该节点的元素取走。
- 如果不为空，则使用CAS的方式将头节点的引用设置成null，如果CAS成功，则直接返回头节点的元素item，如果不成功，表示另外一个线程已经进行了一次出队操作更新了head节点，导致元素发生了变化，需要重新获取头节点。

## Java中的阻塞队列
### 什么是阻塞队列

阻塞队列（BlockingQueue）是一个支持以下两个附加操作的队列：

- 支持阻塞的插入方法：当队列满时，队列会阻塞插入元素的线程，直到队列不满。
- 支持阻塞的移除方法：在队列为空时，获取元素的线程会等待队列变为非空。

阻塞队列常用于生产者和消费者的场景，生产者是向队列里添加元素的线程，消费者是从队列里取元素的线程。阻塞队列就是生产者用来存放元素、消费者用来获取元素的容器

在阻塞队列不可用时，这两个附加操作提供了以下4种处理方式：

|方法/处理方式	|抛出异常|	返回特殊值|	一直阻塞|	超时退出|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|插入方法|add(e)|	offer(e)|	put(e)|	offer(e, time, unit)|
|移除方法|	remove()|	poll()|	take()|	poll(time, unit)|
|检查方法|	element()|	peek()|不可用|	不可用|

- 抛出异常：队列满时，再添加元素，会抛出IllegalStateException("Queue full")异常；当队列为空时，从队列里获取元素会抛出NoSuchElementException异常。
- 返回特殊值：往队列插入元素时，返回ture表示插入成功。从队列里移除元素，即取出元素，如果没有则返回null。
- 一直阻塞：当阻塞队列满时，如果生产者线程往队列里put元素，队列会一直阻塞生产者线程，直到队列可用或者响应中断退出。当队列空时，如果消费者线程从队列里take元素，队列会阻塞住消费者线程，直到队列不为空。
- 超时退出：当阻塞队列满时，如果生产者线程往队列里插入元素，队列会阻塞生产者线程一段时间，如果超过了指定的时间time，生产者线程就会退出。

> 如果是无界阻塞队列，队列不可能会出现满的情况，所以使用put或offer方法永远不会被阻塞，而且使用offer方法时，该方法永远返回true。

### Java里的阻塞队列
- ArrayBlockingQueue：一个由 数组 结构组成的 有界 阻塞队列。   
按照FIFO的原则对元素进行排序  。   
默认情况下不保证线程公平的访问队列。    
公平访问 队列是指阻塞的线程，可以 按照阻塞的先后顺序访问队列，即先阻塞线程先访问队列。   
非公平性是对先等待的线程是非公平的，当队列可用时，阻塞的线程都有争夺访问队列的资格，有可能先阻塞的线程最后才访问队列。

为了保证公平性，通常会降低吞吐量。我们可以使用以下代码创建一个公平的阻塞队列：

```
ArrayBlockingQueue fairQueue = new ArrayBlockingQueue(1000,true);

public ArrayBlockingQueue(int capacity, boolean fair) {
    if (capacity <= 0)
        throw new IllegalArgumentException();
    this.items = new Object[capacity];
    lock = new ReentrantLock(fair);
    notEmpty = lock.newCondition();
    notFull =  lock.newCondition();
}
```
- LinkedBlockingQueue：一个由 链表 结构组成的 有界 阻塞队列。
此队列的默认和最大长度为Integer.MAX_VALUE。此队列按照FIFO的原则对元素进行排序。
- DelayQueue：一个使用优先级队列实现的 无界 阻塞队列。
DelayQueue是一个支持 延时获取元素 的 无界 阻塞队列。
队列使用PriorityQueue来实现。队列中的元素必须实现Delayed接口，在创建元素时可以指定多久才能从队列中获取当前元素。只有在延迟期满时才能从队列中提取元素。
可以将DelayQueue运用在以下应用场景:
- 缓存系统的设计：可以用DelayQueue保存缓存元素的有效期，使用一个线程循环查询DelayQueue，一旦能从DelayQueue中获取元素时，表示缓存有效期到了。
- 定时任务调度：使用DelayQueue保存当天将会执行的任务和执行时间，一旦从DelayQueue中获取到任务就开始执行，比如TimerQueue就是使用DelayQueue实现的。

- LinkedBlockingDeque：一个由 链表 结构组成的 双向 阻塞队列。
所谓双向队列指的是可以从队列的两端插入和移出元素。双向队列因为多了一个操作队列的入口，在多线程同时入队时，也就减少了一半的竞争。
相比其他的阻塞队列，LinkedBlockingDeque多了addFirst、addLast、offerFirst、offerLast、peekFirst和peekLast等方法。
以First单词结尾的方法，表示插入、获取（peek）或移除双端队列的 第一个元素。
以Last单词结尾的方法，表示插入、获取或移除双端队列的 最后一个元素。

### 阻塞队列的实现原理
即为使用 通知模式 实现。就是当生产者往满的队列里添加元素时会阻塞住生产者，当消费者消费了一个队列中的元素后，会通知生产者当前队列可用。

以下是ArrayBlockingQueue的相关代码，我们可以看到它是用Condition来实现的：


```
public ArrayBlockingQueue(int capacity, boolean fair) {
    ...
    notEmpty = lock.newCondition();
    notFull =  lock.newCondition();
}
public void put(E e) throws InterruptedException {
    Objects.requireNonNull(e);
    final ReentrantLock lock = this.lock;
    lock.lockInterruptibly();
    try {
        while (count == items.length)
            notFull.await();
        enqueue(e);
    } finally {
        lock.unlock();
    }
}
public E take() throws InterruptedException {
    final ReentrantLock lock = this.lock;
    lock.lockInterruptibly();
    try {
        while (count == 0)
            notEmpty.await();
        return dequeue();
    } finally {
        lock.unlock();
    }
}
private void enqueue(E x) {
    // assert lock.getHoldCount() == 1;
    // assert items[putIndex] == null;
    final Object[] items = this.items;
    items[putIndex] = x;
    if (++putIndex == items.length) putIndex = 0;
    count++;
    notEmpty.signal();
}
private E dequeue() {
    // assert lock.getHoldCount() == 1;
    // assert items[takeIndex] != null;
    final Object[] items = this.items;
    @SuppressWarnings("unchecked")
    E x = (E) items[takeIndex];
    items[takeIndex] = null;
    if (++takeIndex == items.length) takeIndex = 0;
    count--;
    if (itrs != null)
        itrs.elementDequeued();
    notFull.signal();
    return x;
}
```
## Fork / Join 框架
Fork/Join框架是 Java 7提供的一个用于并行执行任务的框架，是一个 把大任务分割成若干个小任务，最终汇总每个小任务结果后得到大任务结果 的框架。

比如计算1+2+…+10000；可以分割成10个子任务，每个子任务分别对1000个数进行求和，最终汇总这10个子任务的结果。

![](https://user-gold-cdn.xitu.io/2019/12/23/16f31947c19ce65f?w=533&h=699&f=png&s=129315)
工作窃取算法

工作窃取（work-stealing）算法是指某个线程从其他队列里窃取任务来执行。
比如 我们把一个大任务分成 10 个小任务 让 10个线程分别执行一个任务，可能线程1执行的任务很快就完成了，线程2 执行的比较慢，这时候线程1就可以去线程2的任务队列里面去取任务来继续工作，以提高效率。

![](https://user-gold-cdn.xitu.io/2019/12/23/16f319501ce0ce7f?w=587&h=496&f=png&s=89407)

工作窃取算法的优缺点：

- 优点：充分利用线程进行并行计算，减少了线程间的竞争。
- 缺点：在某些情况下还是存在竞争，比如双端队列里只有一个任务时。并且该算法会消耗了更多的系统资源，比如创建多个线程和多个双端队列。

#### Fork/Join框架的设计
* 分割任务
- 执行任务并合并结果

Fork/Join使用以下两个类来完成以上两件事情：
- ForkJoinTask
    我们要使用ForkJoin框架，必须首先创建一个ForkJoin任务。  
它提供在任务中执行 fork()和join()操作的机制。      
通常情况下，我们不需要直接继承ForkJoinTask类，只需要继承它的子类，Fork/Join框架提供了以下两个子类：  
    - RecursiveAction ：用于没有返回结果的任务。
    - RecursiveTask：用于有返回结果的任务。
- ForkJoinPool
    - ForkJoinTask需要通过ForkJoinPool来执行。

任务分割出的子任务会添加到当前工作线程所维护的双端队列中，进入队列的头部。
当一个工作线程的队列里暂时没有任务时，它会随机从其他工作线程的队列的尾部获取一个任务。
### 使用Fork/Join框架

以下示例为使用Fork/Join框架计算 1+2+3+4 ，设置的分割的阈值是2，即1+2+3+4会被分割为1+2 和 3+4两个任务，因为有返回结果，所以我们需要使用RecursiceTask：

```
public class TestRecursiveTask extends RecursiveTask<Integer> {

    /**
     * 阈值
     */
    private static final int THRESHOLD = 2;
    private int start;
    private int end;

    public TestRecursiveTask(int start, int end) {
        this.start = start;
        this.end = end;
    }

    public static void main(String[] args) {
        ForkJoinPool forkJoinPool = new ForkJoinPool();
        // 生成一个计算任务，负责计算1+2+3+4
        TestRecursiveTask task = new TestRecursiveTask(1, 4);
        // 执行一个任务
        Future<Integer> result = forkJoinPool.submit(task);
        try {
            System.out.println(result.get());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    protected Integer compute() {
        int sum = 0;
        // 如果任务足够小就计算任务
        boolean canCompute = (end - start) <= THRESHOLD;
        System.out.println(start + "---" + end);
        if (canCompute) {
            for (int i = start; i <= end; i++) {
                sum += i;
            }
        } else {
            // 如果任务大于阈值，就分裂成两个子任务计算
            int middle = (start + end) / 2;
            TestRecursiveTask leftTask = new TestRecursiveTask(start, middle);
            TestRecursiveTask rightTask = new TestRecursiveTask(middle + 1, end);
            // 执行子任务
            leftTask.fork();
            rightTask.fork();
            // 等待子任务执行完，并得到其结果
            int leftResult = leftTask.join();
            int rightResult = rightTask.join();
            // 合并子任务
            sum = leftResult + rightResult;
        }
        return sum;
    }
}
//1---4
//1---2
//3---4
//10
```
通过这个例子，我们进一步了解ForkJoinTask，ForkJoinTask与一般任务的主要区别在于它需要实现compute方法，在这个方法里，首先需要判断任务是否足够小，如果足够小就直接执行任务。如果不足够小，就必须分割成两个子任务，每个子任务在调用fork方法时，又会进入compute方法，看看当前子任务是否需要继续分割成子任务，如果不需要继续分割，则执行当前子任务并返回结果。使用join方法会等待子任务执行完并得到其结果。


## 结尾
因为很多东西，全是从书上拷贝的，很枯燥，但同时看书，又是最详细的学习方法之一了，大家跟着书看博客，或许会好点吧.


> 因为博主也是一个开发萌新 我也是一边学一边写 我有个目标就是一周 二到三篇 希望能坚持个一年吧 希望各位大佬多提意见，让我多学习，一起进步。
## 日常求赞
> 好了各位，以上就是这篇文章的全部内容了，能看到这里的人呀，都是**真粉**。

> 创作不易，各位的支持和认可，就是我创作的最大动力，我们下篇文章见

>六脉神剑 | 文 【原创】如果本篇博客有任何错误，请批评指教，不胜感激 ！

