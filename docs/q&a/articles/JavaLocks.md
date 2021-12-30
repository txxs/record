[TOC]

---
### 锁分类
> 引用自：https://mp.weixin.qq.com/s/1cWszX8MWXq_XNMXNyeDMg

#### 1. 锁种类

   | 序号 | 锁名称 | 应用 |
   	|---|---|---|
   | 1 | 乐观锁 | CAS|
   | 2 | 悲观锁| synchronized、vector、hashtable|
   | 3 | 自旋锁| CAS|
   | 4 | 可重入锁| synchronized、Reentrantlock、Lock|
   | 5 | 读写锁|ReentrantReadWriteLock，CopyOnWriteArrayList、CopyOnWriteArraySet |
   | 6 | 公平锁| Reentrantlock(true)|
   | 7 | 非公平锁| synchronized、reentrantlock(false)|
   | 8 | 共享锁| ReentrantReadWriteLock中读锁|
   | 9 | 独占锁|synchronized、vector、hashtable、ReentrantReadWriteLock中写锁 |
   | 10| 重量级锁|synchronized |
   | 11| 轻量级锁|锁优化技术 |
   | 12| 偏向锁|锁优化技术 |
   | 13| 分段锁|concurrentHashMap |
   | 14| 互斥锁| synchronized|
   | 15| 同步锁| synchronized|
   | 16| 死锁|相互请求对方的资源 |
   | 17| 锁粗化|锁优化技术 |
   | 18| 锁消除|锁优化技术 |

   乐观锁：是一种乐观思想，假定当前环境是读多写少，遇到并发写的概率比较低，读数据时认为别的线程不会正在进行修改（所以没有上锁）。写数据时，判断当前 与期望值是否相同，如果相同则进行更新（更新期间加锁，保证是原子性的）。Java中的乐观锁：CAS，比较并替换，比较当前值（主内存中的值），与预期值（当前线程中的值，主内存中值的一份拷贝）是否一样，一样则更新，否则继续进行CAS操作。乐观锁在Java中是通过使用无锁编程来实现，最常采用的是CAS算法，Java原子类中的递增操作就通过CAS自旋实现的。

   悲观锁：是一种悲观思想，即认为写多读少，遇到并发写的可能性高，每次去拿数据的时候都认为其他线程会修改，所以每次读写数据都会认为其他线程会修改，所以每次读写数据时都会上锁。其他线程想要读写这个数据时，会被这个线程block，直到这个线程释放锁然后其他线程获取到锁。Java中的悲观锁：synchronized修饰的方法和方法块、ReentrantLock。

   自旋锁：是一种技术，为了让线程等待，我们只须让线程执行一个忙循环（自旋）。如果物理机器有一个以上的处理器或者处理器核心，能让两个或以上的线程同时并行执行，就可以让后面请求锁的那个线程“稍等一会”，但不放弃处理器的执行时间，看看持有锁的线程是否很快就会释放锁。**自旋锁的优点**：避免了线程切换的开销。挂起线程和恢复线程的操作都需要转入内核态中完成；**自旋锁的缺点**：占用处理器的时间，如果占用的时间很长，会白白消耗处理器资源，而不会做任何有价值的工作，带来性能的浪费。**自旋次数默认值**：10次，可以使用参数-XX:PreBlockSpin来自行更改。**自适应自旋**：自适应意味着自旋的时间不再是固定的，而是由前一次在同一个锁上的自旋时间及锁的拥有者的状态来决定的。

   可重入锁：是一种技术，任意线程在获取到锁之后能够再次获取该锁而不会被锁所阻塞。**可重入锁的原理**：通过组合自定义同步器来实现锁的获取与释放；**再次获取锁**：识别获取锁的线程是否为当前占据锁的线程，如果是，则再次成功获取。获取锁后，进行计数自增，**释放锁**：释放锁时，进行计数自减。**Java中的可重入锁**：ReentrantLock、synchronized修饰的方法或代码段。**可重入锁的作用**：避免死锁。面试题1：可重入锁如果加了两把，但是只释放了一把会出现什么问题？答：程序卡死，线程不能出来，也就是说我们申请了几把锁，就需要释放几把锁。

   读写锁：是一种技术，通过ReentrantReadWriteLock类来实现。为了提高性能，Java提供了读写锁，在读的地方使用读锁，在写的地方使用写锁，灵活控制，如果没有写锁的情况下，读是无阻塞的，在一定程度上提高了程序的执行效率。读写锁分为读锁和写锁，多个读锁不互斥，读锁与写锁互斥，这是由 jvm 自己控制的。**读锁**：允许多个线程获取读锁，同时访问同一个资源。**写锁**：只允许一个线程获取写锁，不允许同时访问同一个资源。

   公平锁：是一种思想，多个线程按照申请锁的顺序来获取锁。在并发环境中，每个线程会先查看此锁维护的等待队列，如果当前等待队列为空，则占有锁，如果等待队列不为空，则加入到等待队列的末尾，按照FIFO的原则从队列中拿到线程，然后占有锁。

   非公平锁：是一种思想，线程尝试获取锁，如果获取不到，则再采用公平锁的方式。多个线程获取锁的顺序，不是按照先到先得的顺序，有可能后申请锁的线程比先申请的线程优先获取锁。**优点**：非公平锁的性能高于公平锁。**缺点**：有可能造成线程饥饿（某个线程很长一段时间获取不到锁）。**Java中的非公平锁**：synchronized是非公平锁，ReentrantLock通过构造函数指定该锁是公平的还是非公平的，默认是非公平的。

   共享锁：是一种思想，可以有多个线程获取读锁，以共享的方式持有锁。和乐观锁、读写锁同义。Java中用到的共享锁：ReentrantReadWriteLock。

   独占锁：是一种思想，只能有一个线程获取锁，以独占的方式持有锁。和悲观锁、互斥锁同义。Java中用到的独占锁：synchronized，ReentrantLock。

   重量级锁：是一种称谓，synchronized是通过对象内部的一个叫做监视器锁（monitor）来实现的，监视器锁本身依赖底层的操作系统的Mutex Lock来实现。操作系统实现线程的切换需要从用户态切换到核心态，成本非常高。这种依赖于操作系统 Mutex Lock来实现的锁称为重量级锁。为了优化synchonized，引入了轻量级锁，偏向锁。Java中的重量级锁： synchronized

   轻量级锁：是JDK6时加入的一种锁优化机制，轻量级锁是在无竞争的情况下使用CAS操作去消除同步使用的互斥量。轻量级是相对于使用操作系统互斥量来实现的重量级锁而言的。轻量级锁在没有多线程竞争的前提下，减少传统的重量级锁使用操作系统互斥量产生的性能消耗。如果出现两条以上的线程争用同一个锁的情况，那轻量级锁将不会有效，必须膨胀为重量级锁。**优点**：如果没有竞争，通过CAS操作成功避免了使用互斥量的开销。**缺点**：如果存在竞争，除了互斥量本身的开销外，还额外产生了CAS操作的开销，因此在有竞争的情况下，轻量级锁比传统的重量级锁更慢。

   偏向锁：是JDK6时加入的一种锁优化机制，在无竞争的情况下把整个同步都消除掉，连CAS操作都不去做了。偏是指偏心，它的意思是这个锁会偏向于第一个获得它的线程，如果在接下来的执行过程中，该锁一直没有被其他的线程获取，则持有偏向锁的线程将永远不需要再进行同步。持有偏向锁的线程以后每次进入这个锁相关的同步块时，虚拟机都可以不再进行任何同步操作（例如加锁、解锁及对MarkWord的更新操作等）。**优点**：把整个同步都消除掉，连CAS操作都不去做了，优于轻量级锁。**缺点**：如果程序中大多数的锁都总是被多个不同的线程访问，那偏向锁就是多余的。

   分段锁：是一种机制，最好的例子来说明分段锁是ConcurrentHashMap。ConcurrentHashMap原理：它内部细分了若干个小的 HashMap，称之为段(Segment)。默认情况下一个 ConcurrentHashMap 被进一步细分为 16 个段，既就是锁的并发度。如果需要在 ConcurrentHashMap 添加一项key-value，并不是将整个 HashMap 加锁，而是首先根据 hashcode 得到该key-value应该存放在哪个段中，然后对该段加锁，并完成 put 操作。在多线程环境中，如果多个线程同时进行put操作，只要被加入的key-value不存放在同一个段中，则线程间可以做到真正的并行。**线程安全**：ConcurrentHashMap 是一个 Segment 数组， Segment 通过继承ReentrantLock 来进行加锁，所以每次需要加锁的操作锁住的是一个 segment，这样只要保证每个 Segment 是线程安全的，也就实现了全局的线程安全

   互斥锁：与悲观锁、独占锁同义，表示某个资源只能被一个线程访问，其他线程不能访问。Java中的同步锁： synchronized

   同步锁：与互斥锁同义，表示并发执行的多个线程，在同一时间内只允许一个线程访问共享数据。Java中的同步锁： synchronized

   死锁：是一种现象，如线程A持有资源x，线程B持有资源y，线程A等待线程B释放资源y，线程B等待线程A释放资源x，两个线程都不释放自己持有的资源，则两个线程都获取不到对方的资源，就会造成死锁。Java中的死锁不能自行打破，所以线程死锁后，线程不能进行响应。所以一定要注意程序的并发场景，避免造成死锁。

   锁粗化：是一种优化技术，如果一系列的连续操作都对同一个对象反复加锁和解锁，甚至加锁操作都是出现在循环体体之中，就算真的没有线程竞争，频繁地进行互斥同步操作将会导致不必要的性能损耗，所以就采取了一种方案：把加锁的范围扩展（粗化）到整个操作序列的外部，这样加锁解锁的频率就会大大降低，从而减少了性能损耗。

   锁消除：是一种优化技术，就是把锁干掉。当Java虚拟机运行时发现有些共享数据不会被线程竞争时就可以进行锁消除。那如何判断共享数据不会被线程竞争？**利用逃逸分析技术**：分析对象的作用域，如果对象在A方法中定义后，被作为参数传递到B方法中，则称为方法逃逸；如果被其他线程访问，则称为线程逃逸。在堆上的某个数据不会逃逸出去被其他线程访问到，就可以把它当作栈上数据对待，认为它是线程私有的，同步加锁就不需要了。

   > 图来自：https://mp.weixin.qq.com/s/E2fOUHOabm10k_EVugX08g
   总结成一个图：
   
   ![图片](images/WX20210810-112632@2-1x.png)

#### 2. CAS

   > 引用自：https://mp.weixin.qq.com/s/kvuPxn-vc8dke093XSE5IQ
   
   **CAS的实现步骤如下**

   	1. 获得L(内存地址)上的数据初始值D1
   	2. 对D1的数据进行增减后最终等到D2
   	3. 尝试将D2 放到原来L的位置上
   	4. 放之前先比较目前L里的数据是否跟我之前取出的D1值跟版本号都对应。
   	5. 对应了 我就将数据放到L中，但有一个不对应则写入失败。重新执行步骤1.
   	6. 上面的步骤如果失败了就会重复进入一个1～5的死循环，俗称自旋。

   CAS在语言层面不进行任何处理，直接将原则操作实现在硬件级别实现，只所以可以实现硬件级别的操作核心是因为CAS操作类中有个核心类UnSafe类，Java和C++语言的一个重要区别就是Java中我们无法直接操作一块内存区域，不能像C++中那样可以自己申请内存和释放内存。Java中的Unsafe类为我们提供了类似C++手动管理内存的能力。Unsafe类，全限定名是sun.misc.Unsafe，UnSafe类中所有的方法都是native修饰的，也就是说UnSafe类中的方法都是直接调用操作底层资源执行响应的任务。

   **用CAS的弊端：**

		> 引用自：https://mp.weixin.qq.com/s/riBsXBrIjkOLe7SCtbX8vQ
   1. ABA问题，现象：在内存中数据变化为A==>B==>A,这样如何判别，因为这样其实数据已经修改过了。解决方法：引入版本号。思路很简单，每次compareAndSwap后给数据的版本号加1，下次compareAndSwap的时候不仅比较数据，也比较版本号，值相同，版本号不同也不能执行成功。Java中提供了AtomicStampedReference来解决该问题，AtomicStampedReference内部维护了一个Pair的数据结构，用volatile修饰，保证可见性，用于打包数据对象和版本号
   2. 开销问题：如果长期不成功那就会进入自旋。JVM支持处理器提供的pause指令，使得效率会有一定的提升，pause指令有两个作用：它可以延迟流水线执行指令，使CPU不会消耗过多的执行资源；它可以避免在退出循环的时候因内存顺序冲突（memory order violation）而引起CPU流水线被清空（CPU pipeline flush），从而提高CPU的执行效率。
   3. 只能保证一个共享变量之间的原则性操作，问题描述：当对一个共享变量执行操作时，我们可以使用循环CAS的方式来保证原子操作，但是对多个共享变量操作时，循环CAS就无法保证操作的原子性，这个时候就可以用锁来保证原子性。解决办法：从JDK5开始提供了AtomicReference类来保证引用对象之间的原子性，你可以把多个变量放在一个对象里来进行CAS操作。

**Java8 对 CAS 的优化：**

针对大量线程访问性能和效率问题，在java中引入了新类LongAdder，它对CAS进行了优化，采用了CAS分段机制与自动分段迁移机制。下面我们来看看这两种机制的实现原理。在LongAdder的底层实现中，首先有一个base值，刚开始多线程来不停的累加数值，都是对base进行累加的，比如刚开始累加成了base = 5。接着如果发现并发更新的线程数量过多，就会开始施行分段CAS的机制，也就是内部会搞一个Cell数组，每个数组是一个数值分段。这时，让大量的线程分别去对不同Cell内部的value值进行CAS累加操作，这样就把CAS计算压力分散到了不同的Cell分段数值中了！这样就可以大幅度的降低多线程并发更新同一个数值时出现的无限循环的问题，大幅度提升了多线程并发更新数值的性能和效率！而且他内部实现了自动分段迁移的机制，也就是如果某个Cell的value执行CAS失败了，那么就会自动去找另外一个Cell分段内的value值进行CAS操作。这样也解决了线程空旋转、自旋不停等待执行CAS操作的问题，让一个线程过来执行CAS时可以尽快的完成这个操作。最后，如果你要从LongAdder中获取当前累加的总值，就会把base值和所有Cell分段数值加起来返回给你。

另外一种解释：假如有 5 个线程要对 i 进行自增操作，由于 5 个线程的话，不是很多，起冲突的几率较小，那就让他们按照以往正常的那样，采用 CAS 来自增吧。如果有 100 个线程要对 i 进行自增操作的话，这个时候，冲突就会大大增加，系统就会把这些线程分配到不同的 cell 数组元素去。假如 cell[10] 有 10 个元素吧，且元素的初始化值为 0，那么系统就会把 100 个线程分成 10 组，每一组对 cell 数组其中的一个元素做自增操作，这样到最后，cell 数组 10 个元素的值都为 10，系统在把这 10 个元素的值进行汇总，进而得到 100，二这，就等价于 100 个线程对 i 进行了 100 次自增操作。

 ![图片](images/WX20210810-112632@2-7x.png)

#### 3. synchronized

**3.1. 使用**


		public class Syn {
		    //静态方法
		    public synchronized static void doSth0(){
		    }
		    //同步方法
		    public synchronized void doSth1(){
		    }
		    //同步代码块
		    public void doSth2(){
		        synchronized (Syn.class){
		        }
		    }
		}


**3.2 原理**

   Java Object对象的存储结构：在HotspotJVM中，JavaObject对象在内存中存储中的存储布局分为三个区域，分别是对象头、示例数据、对象填充。如图所示，数组和对象的存储布局十分相似，只是对象的头部大于数组的长度，因为数组需要存储自身的长度，为4Byte。对象头部包括两部分，分别是对象标记和类元信息（类型指针）。对象标记，也就是Markword存储对象的hashCode、GC信息和锁等信息。类元信息存储“类对象信息的指针”。在32位的JVM中，对象头占用8个byte，另外在64位的 JVM 占用16个字节。
    ![图片](images/WX20210810-112632@2-2x.png)

   Mark Word用于存储对象自身的运行时数据，如哈希码（HashCode）、GC分代年龄、锁状态标志、线程持有的锁、偏向线程 ID、偏向时间戳等等。Java对象头一般占有两个机器码（在32位虚拟机中，1个机器码等于4字节，也就是32bit），但是如果对象是数组类型，则需要三个机器码，因为JVM虚拟机可以通过Java对象的元数据信息确定Java对象的大小，但是无法从数组的元数据来确认数组的大小，所以用一块来记录数组长度。对象头信息是与对象自身定义的数据无关的额外存储成本，但是考虑到虚拟机的空间效率，Mark Word被设计成一个非固定的数据结构以便在极小的空间内存存储尽量多的数据，它会根据对象的状态复用自己的存储空间，也就是说，Mark Word会随着程序的运行发生变化，变化状态如下（32位虚拟机）：

![图片](images/WX20210810-112632@2-4x.png)

   synchronized，底层是利用monitor对象（很多线程竞争对象的monitor），CAS和mutex互斥锁来实现的。任何对象都有一个monitor与之关联，当且一个monitor被持有后，它将处于锁定状态。线程执行到monitorenter指令时，将会尝试获取对象所对应的monitor的所有权，即尝试获得对象的锁。修饰代码块，编译后的字节码文件会被加上 monitorenter、monitorexit 指令；修饰方法，锁对象就是当前类的实例，该方法会被打上标记ACC_SYNCHRONIZED，标识是同步方法；修饰静态方法，锁对象则是当前类Class对象。利用javap查看字节码文件，同步代码块中有**两个monitorexit**是因为需要考虑异常情况也要释放锁。

   synchronized用的锁是存在Java对象头里的。如果对象是数组类型，则虚拟机用3个字宽（Word）存储对象头，如果对象是非数组类型，则用2字宽存储对象头。在32位虚拟机中，1字宽等于4字节，即32bit。数组类多一个字节用于存储数组长度，也就是说程序获取数组长度的时间复杂度为O(1)。

   > 引用自：https://mp.weixin.qq.com/s/c5uNPaIACSUqmFmr8EOXaA
   
   解释了未竞争到锁的线程去哪里了：所有的Java对象是天生的Monitor，每一个Java对象都有成为Monitor的潜质（每一个线程竞争的就是锁的内容），因为在Java的设计中，每一个Java对象自打娘胎里出来就带了一把看不见的锁，它叫做内部锁或者Monitor锁。每个对象都存在着一个Monitor与之关联，对象与其Monitor之间的关系有存在多种实现方式。先来看monitor的内部，monitor在HotSpot由c++实现，类名objectMonitor。objectMonitor.hpp 中，monitor 结构如下 （1.8 版本）：
   ```
   // initialize the monitor, exception the semaphore, all other fields
   // are simple integers or pointers
   ObjectMonitor() {
   _header       = NULL;
   _count        = 0;
   _waiters      = 0,
   _recursions   = 0;
   _object       = NULL;
   _owner        = NULL;
   _WaitSet      = NULL;
   _WaitSetLock  = 0 ;
   _Responsible  = NULL ;
   _succ         = NULL ;
   _cxq          = NULL ;
   FreeNext      = NULL ;
   _EntryList    = NULL ;
   _SpinFreq     = 0 ;
   _SpinClock    = 0 ;
   OwnerIsThread = 0 ;
   _previous_owner_tid = 0;
   }
   ```

   objectMonitor内部会有等待队列（cxq和Entrylist）和条件等待队列（waitSet）来存放相应的阻塞线程。未竞争到锁的线程存储到等待队列中，获得锁的线程调用wait后存放到条件等待队列中，解锁会唤醒相应队列中的等待线程来竞争锁。使用 _cxq 和 _EntryList 两个列表来放线程的原因是，多个线程同时竞争锁，先放到 _cxq 单链表基于 CAS 来 hold 住并发，根据策略每次唤醒的时候搬迁一些线程节点到 _EntryList 这个双向链表，降低 _cxq 的尾部竞争。线程的阻塞和唤醒，需要调用操作系统进行上下文切换，开销比较大，所以称为重量级锁。

![图片](images/WX20210810-112632@2-3x.png)

> 引用自（非常好）：https://mp.weixin.qq.com/s/esLXkYi3KiYMxYDiVXSnkA
   
monitorenter指令插入到同步代码块的开始位置，monitorexit指令插入到同步代码块的结束位置，JVM需要保证每一个monitorenter都有monitorexit与之对应。任何对象都有一个监视器锁（monitor）关联，线程执行monitorenter指令时尝试获取monitor的所有权。
   
> 引用自：https://mp.weixin.qq.com/s?__biz=MzI3NzE0NjcwMg==&mid=2650120537&idx=1&sn=f56201217c0ca6fde45ee12965b56296&chksm=f36bbc78c41c356ee363367addcdc0b311afb2f9df86a7ee20d21348b3332fd64f273d6028ca&scene=21#wechat_redirect

同步方法：同步方法通过ACC_SYNCHRONIZED关键字隐式的对方法进行加锁。当线程要执行的方法被标注上ACC_SYNCHRONIZED时，需要先获得锁才能执行该方法。方法中的synchronized与代码块中实现的方式不同，方法中会添加一个叫ACC_SYNCHRONIZED的标志，当调用方法时，首先会检查是否有ACC_SYNCHRONIZED标志，如果存在，则获取monitor对象，调用monitorenter和monitorexit指令。

同步代码块：同步代码块通过monitorenter和monitorexit执行来进行加锁。当线程执行到monitorenter的时候要先获得所锁，才能执行后面的方法。当线程执行到monitorexit的时候则要释放锁。可以把执行monitorenter指令理解为加锁，执行monitorexit理解为释放锁。 每个对象维护着一个记录着被锁次数的【计数器】。未被锁定的对象的该【计数器】为0，当一个线程获得锁（执行monitorenter）后，该计数器自增变为 1 ，当同一个线程再次获得该对象的锁的时候，计数器再次自增。当同一个线程释放锁（执行monitorexit指令）的时候，计数器再自减。当计数器为0的时候。锁将被释放，其他线程便可以获得锁。

解释了可重入：如果monitor的进入数为0，则该线程进入monitor，然后将进入数设置为1，该线程为monitor的所有者；如果线程已经占有该monitor，重新进入，则monitor的进入数加1；线程执行monitorexit，monitor的进入数-1，执行过多少次monitorenter，最终要执行对应次数的monitorexit；如果其他线程已经占用monitor，则该线程进入阻塞状态，直到monitor的进入数为0，再重新尝试获取monitor的所有权。每个对象自身维护这一个被加锁次数的【计数器】，当计数器数字为0时表示可以被任意线程获得锁。当计数器不为0时，只有获得锁的线程才能再次获得锁。即可重入锁。

> 引用自：https://mp.weixin.qq.com/s/esLXkYi3KiYMxYDiVXSnkA
   
**3.3. 锁优化**

   Jdk1.5以后对Synchronized关键字做了各种的优化，经过优化后Synchronized已经变得原来越快了，这也是为什么官方建议使用Synchronized的原因，具体的优化的过程如下：**编译期：锁粗化，锁消除 ->运行期：自旋 -> 运行期：锁升级**。
   
   下边两个例子分别讲述了**锁消除和锁粗化**
   
		```
   				//【1】锁消除
		        synchronized (new Object()){
		            int i = 1000 + 200;
		        }
		        
		        //【1】处的锁，只在方法内部，也就是只在栈内部，没有逃逸到外部，因此可以消除
		        //Java虚拟机在JIT编译时(可以简单理解为当某段代码即将第一次被执行时进行编译，又称即时编译)，
		        // 通过对运行上下文的扫描，经过逃逸分析（对象在函数中被使用，也可能被外部函数所引用，称为函数逃逸），
		        // 去除不可能存在共享资源竞争的锁，通过这种方式消除没有必要的锁，可以节省毫无意义的时间消耗。变成下边的样子：
		        int i = 1000 + 200;
		        
		        
		        for (int i = 0; i <= 10; i++) {
		            //【2】锁粗化
		            synchronized (this){
		                i = i +2;
		            }
		        }
		        //【2】处锁就很细，可以粗化；
		        // 锁粗化就是将「多个连续的加锁、解锁操作连接在一起」，扩展成一个范围更大的锁，避免频繁的加锁解锁操作。
		        synchronized (this){
		            for (int i = 0; i <= 10; i++) {
		                i = i +2;
		            }
		        }
		```
   > 引用自：https://segmentfault.com/a/1190000037659848
   
   **自旋锁**线程的阻塞和唤醒需要CPU从用户态切转为核心态，而且这种切换不易优化。如果锁的粒度很小，即锁持有的时间很短的时候。由锁竞争造成频繁地阻塞和唤醒线程就显得非常不值得，因此引入了自旋锁。自旋锁可以减少线程阻塞造成的线程切换。其执行步骤如下：
   - 当前线程尝试去竞争锁。
   - 竞争失败，准备阻塞自己。
   - 但是并没有阻塞自己，进入自旋状态（空等待，比如一个空的有限for循环）。
   - 自旋状态下，继续竞争锁。
   - 如果自旋期间成功获取锁，那么结束自旋状态，否则进入阻塞状态。
   - 如果在自旋期间成功获取锁，那么就减少一次线程的切换。 
	 
  可见，如果持有锁的线程很快就释放了锁，那么自旋的效率就非常好，反之，自旋的线程就会白白消耗掉处理的资源。所以自旋锁适合在持有锁时间短，并且竞争激烈的场景下使用。在JDK1.6中自旋锁默认开启。可以使用-XX:+UseSpinning开启，-XX:-UseSpinning关闭自旋锁优化。自旋的默认次数为10次，可以使用-XX:preBlockSpin参数修改默认的自旋次数。
  适应性自旋：是赋予了自旋一种学习能力，它并不固定自旋10次。他可以根据它前面线程的自旋情况，从而调整它的自旋。例如，线程总是自旋成功，那么虚拟机就会允许自旋等待持续的次数更多。反之，如果对于某个锁，很少有自旋能够成功，那么在以后竞争这个锁的时，自旋的次数会减少甚至省略掉自旋过程直接进入阻塞状态，以免浪费处理器资源。
  
**锁升级：无锁—>偏向锁**：在大多数情况下，锁不仅不存在多线程竞争，而且总是由同一线程多次获得，为了减少此类情况下线程获得锁的性能消耗，JDK6中引进了偏向锁。当一个线程访问同步代码块并获取锁时，会在Mark Word里存储锁偏向的线程ID。在线程进入和退出同步块时不再通过CAS操作来加锁和解锁，而是检测MarkWord里是否存储着指向当前线程的偏向锁。引入偏向锁是为了在没有多线程竞争的情况下尽量减少不必要的轻量级锁执行路径，偏向锁只需要在置换ThreadID的时候依赖一次CAS原子指令即可。偏向锁只有遇到其他线程尝试竞争偏向锁时，持有偏向锁的线程才会释放锁，线程不会主动释放偏向锁。偏向锁的撤销，需要等待全局安全点（在这个时间点上没有字节码正在执行），它会首先暂停拥有偏向锁的线程，判断锁对象是否处于被锁定状态。撤销偏向锁后恢复到无锁（标志位为“01”）或轻量级锁（标志位为“00”）的状态。偏向锁在JDK6及以后的JVM里是默认启用的。可以通过JVM参数关闭偏向锁：-XX:-UseBiasedLocking=false，关闭之后程序默认会进入轻量级锁状态。
  
**锁升级：偏向锁—>轻量级锁**：偏向锁多应用只有一个线程访问同步块场景中，一旦偏向锁被其他线程访问，就会升级为轻量级锁。其他线程会通过自旋的形式尝试获取锁，不会阻塞，从而提高性能。使用轻量级锁的多线程之间不存在锁竞争，线程是交替执行同步块的。引入轻量级锁的目的正是在没有多线程竞争的前提下，减少传统的重量级锁使用操作系统互斥量产生的性能消耗。轻量级锁的获取主要有两种情况：① 当关闭偏向锁功能时；② 多个线程竞争偏向锁导致偏向锁升级为轻量级锁。

**锁升级：轻量级锁—>重量级锁**：轻量级锁膨胀之后，就升级为重量级锁，重量级锁是依赖操作系统的MutexLock（互斥锁）来实现的，需要从用户态转到内核态，这个成本非常高，这就是为什么Java1.6之前Synchronized效率低的原因。升级为重量级锁时，锁标志位的状态值变为10，此时Mark Word中存储内容的是重量级锁的指针，等待锁的线程都会进入阻塞状态。 轻量级锁什么时候会解锁失败呢？在发生锁竞争时并且占用锁的线程未释放，这时（自旋默认了10次还是未获取到锁）竞争锁的线程就会将MarkWord修改为重量级锁，并且将自己阻塞在该锁的monitor对象上。之后占用锁的线程将栈帧中的 Mark Word进行CAS替换回对象头的 Mark Word 的时候，发现有其它线程竞争该锁（已经由竞争锁的线程更改了锁状态），然后它释放锁并且唤醒在等待的线程，后续的线程操作就全部都是重量级锁了。

**锁升级：重量级锁**：轻量级锁膨胀之后，就升级为重量级锁，重量级锁是依赖操作系统的MutexLock（互斥锁）来实现的，需要从用户态转到内核态，这个成本非常高，这就是为什么Java1.6之前Synchronized效率低的原因。升级为重量级锁时，锁标志位的状态值变为10，此时Mark Word中存储内容的是重量级锁的指针，等待锁的线程都会进入阻塞状态，下面是简化版的锁升级过程。锁升级的过程如下：

![图片](images/WX20210810-112632@2-5x.png)

1. 当没有被加锁时，Mark Word 记录对象的 HashCode，是否偏向锁是 0，锁标志位是 01。
2. 当对象被作为同步锁，并且线程 A 抢到锁时，锁标志位仍是 01，是否偏向锁标记为 1，前 54 位写入线程 A 的 id，此时进入偏向锁状态。
3. 当线程 A 再次尝试加锁时，判断偏向锁标志是 1，Mark Word 中记录的线程 id 就是当前线程 A，表示线程 A 已经获得了这个偏向锁。
4. 当线程 B 尝试获取锁时，判断偏向锁标志是 1，但是 Mark Word 中的线程 id 不是线程 B，则进行偏向锁撤销，进行锁升级。
5. 偏向锁状态获取失败，代表存在一定的竞争，偏向锁升级为轻量级锁。在当前线程的线程栈中开辟一块单独的空间 LockRecord，保存锁对象 Mark Word，同时在锁对象 Mark Word 中保存指向 LockRecord 地址。如果成功，则把 Mark Word 中的锁标志位改成 00。
6. 轻量级锁抢锁失败，进行锁膨胀，升级为重量级锁之前，会先进行自适应自旋，自旋成功则获取到锁。
7. 自旋后仍抢锁失败，则升级为重量级锁，锁标志位改为 10。在这个状态下，未抢到锁的线程都会被阻塞。

| 锁 | 优点 | 缺点 | 适用场景 |
|---|---|---|---|
| 偏向锁 | 加锁和解锁不需要额外消耗，和执行非同步方法相比仅仅存在纳秒级的差距。 | 线程间存在锁竞争，会带来额外的锁撤销的消耗。|适用于只有一个线程访问同步块场景。|
| 轻量级锁 | 竞争的线程不会阻塞，提高了线程的响应速度。| 如果始终得不到锁竞争的线程，使用自旋会消耗CPU。	|追求响应速度，同步块执行速度非常快。|
| 重量级锁 | 线程竞争不会使用自旋，不会消耗CPU。| 线程阻塞，响应时间缓慢。|追求吞吐量，同步块执行时间较长。|


**3.4. notify&wait原理:**

当一个线程尝试获得锁时，如果该锁已经被占用，则会将该线程封装成一个ObjectWaiter对象插入到cxq的队列尾部，然后暂停当前线程。当持有锁的线程释放锁前，会将cxq中的所有元素移动到EntryList中去，并唤醒EntryList的队首线程。如果一个线程在同步块中调用了Object#wait方法，会将该线程对应的ObjectWaiter从EntryList移除并加入到WaitSet中，然后释放锁。当wait的线程被notify之后，会将对应的ObjectWaiter从WaitSet移动到EntryList中。Monitor对象 中包含一个同步队列（由 _cxq 和 _EntryList 组成）和一个等待队列（ _WaitSet ）。注意：synchronized的同步队列和等待队列 与 基于AQS（lock/condition）的同步队列和等待队列实现原理类似，只不过前者是一个同步队列对应一个等待队列，而后者是一个同步队列可以对应多个等待队列。1、为什么要有Object.wait/notify，只使用synchronized不能也能实现线程阻塞然后被其他线程唤醒（通知）么？2、执行Object.wait/notify，为什么必须要在synchronized中呢？关于第一个问题，只使用synchronized是为了简单的加解锁，而使用Object.wait/notify是为了实现被通知后，再执行下一步动作的逻辑。如果Object.wait后没有任何逻辑的话，这里的Object.wait是没有意义的，可以直接去掉。对于第二个问题，为什么必须要在synchronized中呢，我们都知道synchronized锁机制大都是为了保证原子性，因此我们有理由相信，这里的原因大概率就是原子性。那么是为了什么的原子性呢？是为了保证在Object.wait时，将当前线程添加到_WaitSet等待队列和monitor out唤醒其他线程的原子性；为了保证在Object.notify 时，在将当前线程从WaitSet移到同步队列时，锁相关的线程状态不会发生变化。

![图片](images/WX20210810-112632@2-6x.png)

其他不错的文章：
1. https://mp.weixin.qq.com/s/E2fOUHOabm10k_EVugX08g
2. https://github.com/farmerjohngit/myblog/issues/15

#### 4. AbstractQueuedSynchronizer

> 整体不错的文章：https://mp.weixin.qq.com/s/Y4GbMdNmSDvHtomxtObRSg

> 整体不错的文章：https://zhuanlan.zhihu.com/p/178991617

> 整体不错的文章：https://mp.weixin.qq.com/s/cJ0t1vQGzBe6AnaB8sYXaA

> 整体不错的文章：https://mp.weixin.qq.com/s/-fDGn-AIYJ64Q1MlqpDiBg

> 整体不错的文章： https://mp.weixin.qq.com/s/z4IP1UE-bxwzoTLNONYbBw

> 整体不错的文章： https://mp.weixin.qq.com/s/Scz_puodkdtoA6Zz7nh4uA?from=groupmessage&scene=1&subscene=10000&clicktime=1614220502&enterid=1614220502

> 整体不错的文章： https://mp.weixin.qq.com/s/z4IP1UE-bxwzoTLNONYbBw

##### 4.1 **什么是AQS？**

AQS是JDK1.5提供的一个基于FIFO等待队列实现的一个用于实现同步器的基础框架，这个基础框架的重要性可以这么说，JCU包里面几乎所有的有关锁、多线程并发以及线程同步器等重要组件的实现都是基于AQS这个框架。AQS的核心思想是基于volatile int state这样的一个属性同时配合Unsafe工具对其原子性的操作来实现对当前锁的状态进行修改。当state的值为0的时候，标识改Lock不被任何线程所占有。

> 引用自：https://mp.weixin.qq.com/s/Y4GbMdNmSDvHtomxtObRSg

AbstractQueuedSynchronizer抽象同步队列简称AQS，它是实现同步器的基础组件，如常用的ReentrantLock、Semaphore、CountDownLatch等。AQS定义了一套多线程访问共享资源的同步模板，解决了实现同步器时涉及的大量细节问题，能够极大地减少实现工作，AQS的原理对于架构设计还是很有帮助的。下面是AQS的组成结构：

![图片](images/WX20210725-165411@2-1x.png)

作为AQS的核心实现的一部分，举个例子来描述一下这个队列长什么样子，我们假设目前有三个线程Thread1、Thread2、Thread3同时去竞争锁，如果结果是Thread1获取了锁，Thread2和Thread3进入了等待队列，那么他们的样子如下：

![图片](images/WX20210725-165411@2-2x.png)

AQS由三部分组成，**state同步状态**、**Node组成的CLH队列**、**ConditionObject条件变量（包含Node组成的条件单向队列）**，线程的阻塞和解除阻塞。AQS中采用了LockSupport.park(thread) 来挂起线程，用unpark来唤醒线程。因为争抢锁的线程可能很多，但是只能有一个线程拿到锁，其他的线程都必须等待，这个时候就需要一个queue来管理这些线程，AQS用的是一个FIFO的队列，就是一个链表，每个node都持有后继节点的引用。下面会分别对这三部分做介绍。

##### 4.2 **同步状态**

在AQS中维护了一个同步状态变量state，getState函数获取同步状态，setState、compareAndSetState函数修改同步状态，对于AQS来说，线程同步的关键是对state的操作，可以说获取、释放资源是否成功都是由state决定的，比如state>0代表可获取资源，否则无法获取，所以state的具体语义由实现者去定义，现有的ReentrantLock、ReentrantReadWriteLock、Semaphore、CountDownLatch定义的state语义都不一样。

- ReentrantLock的state用来表示是否有锁资源
- ReentrantReadWriteLock的state高16位代表读锁状态，低16位代表写锁状态
- Semaphore的state用来表示可用信号的个数
- CountDownLatch的state用来表示计数器的值

锁状态。我们要知道锁是不是被别的线程占有了，这个就是state的作用，它为0的时候代表没有线程占有锁，可以去争抢这个锁，用CAS将state设为1，如果CAS成功，说明抢到了锁，这样其他线程就抢不到了，如果锁重入的话，state进行+1就可以，解锁就是减1，直到state又变为0，代表释放锁，所以lock() 和unlock() 必须要配对啊。然后唤醒等待队列中的第一个线程，让其来占有锁。

##### 4.3 **CLH队列**

由于CLH锁是一种自旋锁，那么我们先来看看自旋锁是什么？自旋锁说白了也是一种互斥锁，只不过没有抢到锁的线程会一直自旋等待锁的释放，处于busy-waiting的状态，此时等待锁的线程不会进入休眠状态，而是一直忙等待浪费CPU周期。因此自旋锁适用于锁占用时间短的场合。这里谈到了自旋锁，那么我们也顺便说下互斥锁。这里的互斥锁说的是传统意义的互斥锁，就是多个线程并发竞争锁的时候，没有抢到锁的线程会进入休眠状态即sleep-waiting，当锁被释放的时候，处于休眠状态的一个线程会再次获取到锁。缺点就是这一些列过程需要线程切换，需要执行很多CPU指令，同样需要时间。如果CPU执行线程切换的时间比锁占用的时间还长，那么可能还不如使用自旋锁。因此互斥锁适用于锁占用时间长的场合。CLH锁其实就是一种是基于逻辑队列非线程饥饿的一种自旋公平锁，由于是 Craig、Landin 和 Hagersten三位大佬的发明，因此命名为CLH锁。

> 引用自：https://wkee.net/post/discussion-on-thread-lock-algorithm-special-of-algorithm-data-structure-special.html

CLH数据模型：CLH队列中的结点QNode中含有一个locked字段，该字段若为true表示该线程需要获取锁，且不释放锁，为false表示线程释放了锁。结点之间是通过隐形的链表相连，之所以叫隐形的链表是因为这些结点之间没有明显的 next 指针，而是通过myPred所指向的结点的变化情况来影响myNode的行为。CLH原理：

- 首先有一个尾节点指针，通过这个尾结点指针来构建等待线程的逻辑队列，因此能确保线程线程先到先服务的公平性，因此尾指针可以说是构建逻辑队列的桥梁；此外这个尾节点指针是原子引用类型，避免了多线程并发操作的线程安全性问题；

- 通过等待锁的每个线程在自己的某个变量上自旋等待，这个变量将由前一个线程写入。由于某个线程获取锁操作时总是通过尾节点指针获取到前一线程写入的变量，而尾节点指针又是原子引用类型，因此确保了这个变量获取出来总是线程安全的。

![图片](images/WX20210725-165411@2-3x.png)

CLH是AQS内部维护的FIFO（先进先出）双端双向队列（方便尾部节点插入），基于链表数据结构，当一个线程竞争资源失败，就会将等待资源的线程封装成一个Node节点，通过CAS原子操作插入队列尾部，最终不同的Node节点连接组成了一个CLH队列，所以说AQS通过CLH队列管理竞争资源的线程，个人总结CLH队列具有如下几个优点：

- 先进先出保证了公平性
- 非阻塞的队列，通过自旋锁和CAS保证节点插入和移除的原子性，实现无锁快速插入
- 采用了自旋锁思想，所以CLH也是一种基于链表的可扩展、高性能、公平的自旋锁

> 引用自：https://coderbee.net/index.php/concurrent/20131115/577

##### 4.4 **CLH队列由来过程**

1. 自旋锁（SPINLOCK）自旋锁是指当一个线程尝试获取某个锁时，如果该锁已被其他线程占用，就一直循环检测锁是否被释放，而不是进入线程挂起或睡眠状态。自旋锁适用于锁保护的临界区很小的情况，临界区很小的话，锁占用的时间就很短。简单的实现：

```
import java.util.concurrent.atomic.AtomicReference;

public class SpinLock {
   private AtomicReference<Thread> owner = new AtomicReference<Thread>();

   public void lock() {
       Thread currentThread = Thread.currentThread();

              // 如果锁未被占用，则设置当前线程为锁的拥有者
       while (!owner.compareAndSet(null, currentThread)) {
       }
   }

   public void unlock() {
       Thread currentThread = Thread.currentThread();

              // 只有锁的拥有者才能释放锁
       owner.compareAndSet(currentThread, null);
   }
}
```

SimpleSpinLock里有一个owner属性持有锁当前拥有者的线程的引用，如果该引用为null，则表示锁未被占用，不为null则被占用。这里用AtomicReference是为了使用它的原子性的compareAndSet方法（CAS操作），解决了多线程并发操作导致数据不一致的问题，确保其他线程可以看到锁的真实状态。缺点:1. CAS操作需要硬件的配合；2. 保证各个CPU的缓存（L1、L2、L3、跨CPU Socket、主存）的数据一致性，通讯开销很大，在多处理器系统上更严重；3. 没法保证公平性，不保证等待进程/线程按照FIFO顺序获得锁。

2. TICKET LOCK:Ticket Lock 是为了解决上面的公平性问题，类似于现实中银行柜台的排队叫号：锁拥有一个服务号，表示正在服务的线程，还有一个排队号；每个线程尝试获取锁之前先拿一个排队号，然后不断轮询锁的当前服务号是否是自己的排队号，如果是，则表示自己拥有了锁，不是则继续轮询。当线程释放锁时，将服务号加1，这样下一个线程看到这个变化，就退出自旋。简单的实现:


```
import java.util.concurrent.atomic.AtomicInteger;

public class TicketLock {
   private AtomicInteger serviceNum = new AtomicInteger(); // 服务号
   private AtomicInteger ticketNum = new AtomicInteger(); // 排队号

   public int lock() {
         // 首先原子性地获得一个排队号
         int myTicketNum = ticketNum.getAndIncrement();

              // 只要当前服务号不是自己的就不断轮询
       while (serviceNum.get() != myTicketNum) {
       }

       return myTicketNum;
    }

    public void unlock(int myTicket) {
        // 只有当前线程拥有者才能释放锁
        int next = myTicket + 1;
        serviceNum.compareAndSet(myTicket, next);
    }
}
```

缺点:Ticket Lock 虽然解决了公平性的问题，但是多处理器系统上，每个进程/线程占用的处理器都在读写同一个变量serviceNum，每次读写操作都必须在多个处理器缓存之间进行缓存同步，这会导致繁重的系统总线和内存的流量，大大降低系统整体的性能。下面介绍的CLH锁和MCS锁都是为了解决这个问题的。

3. MCS锁:MCS Spinlock 是一种基于链表的可扩展、高性能、公平的自旋锁，申请线程只在本地变量上自旋，直接前驱负责通知其结束自旋，从而极大地减少了不必要的处理器缓存同步的次数，降低了总线和内存的开销。

```
import java.util.concurrent.atomic.AtomicReferenceFieldUpdater;

public class MCSLock {
    public static class MCSNode {
        volatile MCSNode next;
        volatile boolean isBlock = true; // 默认是在等待锁
    }

    volatile MCSNode queue;// 指向最后一个申请锁的MCSNode
    private static final AtomicReferenceFieldUpdater UPDATER = AtomicReferenceFieldUpdater
            .newUpdater(MCSLock.class, MCSNode.class, "queue");

    public void lock(MCSNode currentThread) {
        MCSNode predecessor = UPDATER.getAndSet(this, currentThread);// step 1
        if (predecessor != null) {
            predecessor.next = currentThread;// step 2

            while (currentThread.isBlock) {// step 3
            }
        }else { // 只有一个线程在使用锁，没有前驱来通知它，所以得自己标记自己为非阻塞
               currentThread. isBlock = false;
          }
    }

    public void unlock(MCSNode currentThread) {
        if (currentThread.isBlock) {// 锁拥有者进行释放锁才有意义
            return;
        }

        if (currentThread.next == null) {// 检查是否有人排在自己后面
            if (UPDATER.compareAndSet(this, currentThread, null)) {// step 4
                // compareAndSet返回true表示确实没有人排在自己后面
                return;
            } else {
                // 突然有人排在自己后面了，可能还不知道是谁，下面是等待后续者
                // 这里之所以要忙等是因为：step 1执行完后，step 2可能还没执行完
                while (currentThread.next == null) { // step 5
                }
            }
        }

        currentThread.next.isBlock = false;
        currentThread.next = null;// for GC
    }
}
```

4. CLH锁:CLH锁也是一种基于链表的可扩展、高性能、公平的自旋锁，申请线程只在本地变量上自旋，它不断轮询前驱的状态，如果发现前驱释放了锁就结束自旋。

```
import java.util.concurrent.atomic.AtomicReferenceFieldUpdater;

public class CLHLock {
    public static class CLHNode {
        private volatile boolean isLocked = true; // 默认是在等待锁
    }

    @SuppressWarnings("unused" )
    private volatile CLHNode tail ;
    private static final AtomicReferenceFieldUpdater<CLHLock, CLHNode> UPDATER = AtomicReferenceFieldUpdater
                  . newUpdater(CLHLock.class, CLHNode .class , "tail" );

    public void lock(CLHNode currentThread) {
        CLHNode preNode = UPDATER.getAndSet( this, currentThread);
        if(preNode != null) {//已有线程占用了锁，进入自旋
            while(preNode.isLocked ) {
            }
        }
    }

    public void unlock(CLHNode currentThread) {
        // 如果队列里只有当前线程，则释放对当前线程的引用（for GC）。
        if (!UPDATER .compareAndSet(this, currentThread, null)) {
            // 还有后续线程
            currentThread. isLocked = false ;// 改变状态，让后续线程结束自旋
        }
    }
}
```
- 加锁逻辑：获取当前线程的锁节点，如果为空则进行初始化；通过同步方法获取尾节点，并将当前节点置为尾节点，此时获取到的尾节点为当前节点的前驱节点；如果尾节点为空，则表示当前节点为第一个节点，加锁成功；如果尾节点不为空，则基于前驱节点的锁值（locked==true）进行自旋，直到前驱节点的锁值 locked == false。

- 解锁逻辑：获取当前线程的锁节点，如果节点为空或者锁值（locked== false）则无需解锁，直接返回；使用同步方法为尾节点赋空值，赋值不成功则表示当前节点不是尾节点，需要将当前节点的locked==false已保证解锁该节点；如果当前节点为尾节点，则无需设置该节点的锁值。因为该节点没有后置节点，即使设置了，也没有实际意义。

> 非常优秀的文章：https://coderbee.net/index.php/concurrent/20131115/577

CLH锁和MCS锁对比：

![图片](images/WX20210725-165411@2-4x.png)

- 从代码实现来看，CLH比MCS要简单得多。
- 从自旋的条件来看，CLH是在前驱节点的属性上自旋，而MCS是在本地属性变量上自旋。
- 从链表队列来看，CLH的队列是隐式的，CLHNode并不实际持有下一个节点；MCS的队列是物理存在的。
- CLH锁释放时只需要改变自己的属性，MCS锁释放则需要改变后继节点的属性。

**Node内部类**

```
public abstract class AbstractQueuedSynchronizer extends AbstractOwnableSynchronizer implements java.io.Serializable {

	 private transient volatile Node head;
	 private transient volatile Node tail;
	 private volatile int state;

	 static final class Node {
        static final Node SHARED = new Node();
        static final Node EXCLUSIVE = null;
        static final int CANCELLED =  1;
        static final int SIGNAL    = -1;
        static final int CONDITION = -2;
        static final int PROPAGATE = -3;
        volatile int waitStatus;
        volatile Node prev;
        volatile Node next;
        volatile Thread thread;
        Node nextWaiter;
        final boolean isShared() {
            return nextWaiter == SHARED;
        }

        final Node predecessor() throws NullPointerException {
            Node p = prev;
            if (p == null)
                throw new NullPointerException();
            else
                return p;
        }

        Node() {    // Used to establish initial head or SHARED marker
        }

        Node(Thread thread, Node mode) {     // Used by addWaiter
            this.nextWaiter = mode;
            this.thread = thread;
        }

        Node(Thread thread, int waitStatus) { // Used by Condition
            this.waitStatus = waitStatus;
            this.thread = thread;
        }
    }

}

```

> 引用自：https://mp.weixin.qq.com/s/z4IP1UE-bxwzoTLNONYbBw

在AbstractQueuedSynchronizer类中，有一个内部类Node，通过该类构造一个内部的同步队列，这是一个FIFO 双向队列。当前运行线程回去同步状态时，如果获取失败，则将当前线程信息创建一个Node追加到同步队列尾部，然后阻塞当前线程，直到队列的上一个节点的同步状态释放，再唤醒当前线程尝试重新获取同步状态。这个重新获取同步状态操作的节点，一定要是同步队列中第一节点。

同步队列中被阻塞的线程的等待状态包含有四个常量值：CANCELLED、SIGNAL、CONDITION、PROPAGATE ，它们对应的被阻塞原因如下：

- CANCELLED 同步队列中当前节点的线程等待超时或被中断，需要从同步队列中取消等待。
- SIGNAL 当前节点释放同步状态或被取消后，通知后继节点的线程运行。
- CONDITION 当前节点在 Condition 上等待，当其他线程对 Condition 调用了 signal() 方法后，该节点将添加到同步队列中。
- PROPAGATE 该状态存在共享模式的首节点中，当前节点唤醒后将传播唤醒其他节点。

同步器(AQS)中持有同步队列的首节点和尾节点的引用，在AbstractQueuedSynchronizer中分别对应head和tail字段。

![图片](images/WX20210725-165411@2-5x.png)

或者是下边的图：

![图片](images/WX20210725-165411@2-6x.png)

入队：获取资源失败的线程需要封装成Node节点，接着尾部入队，在AQS中提供addWaiter函数完成Node节点的创建与入队。添加节点的时候，如果从CLH队列已经存在，通过CAS快速将当前节点添加到队列尾部，如果添加失败或队列不存在，则指向enq函数自旋入队。通过自旋CAS尝试往队列尾部插入节点，直到成功，自旋过程如果发现CLH队列不存在时会初始化CLH队列。大致过程如下：



- 刚开始CLH队列不存在，head与tail都指向null
- 要初始化CLH队列，会创建一个哨兵节点，head与tail都指向哨兵节点
- 当前线程节点的前驱节点指向尾部节点（哨兵节点）
- 设置当前线程节点为尾部，tail指向当前线程节点
- 前尾部节点的后驱节点指向当前线程节点（当前尾部节点）

```
   /**
     * @description:  Node节点入队-CLH队列
     * @param mode 标记  Node.EXCLUSIVE独占式 or Node.SHARED共享式
     */
    private Node addWaiter(Node mode) {
        //根据当前线程创建节点，等待状态为0
        Node node = new Node(Thread.currentThread(), mode);
        // 获取尾节点
        Node pred = tail;
        if (pred != null) {
            //如果尾节点不等于null，把当前节点的前驱节点指向尾节点
            node.prev = pred;
            //通过cas把尾节点指向当前节点
            if (compareAndSetTail(pred, node)) {
                //之前尾节点的下个节点指向当前节点
                pred.next = node;
                return node;
            }
        }
        //如果添加失败或队列不存在，执行end函数
        enq(node);
        return node;
    }

  /**
     * @description: 自旋cas入队
     * @param node 节点
     */
    private Node enq(final Node node) {
        for (;;) { //循环
            //获取尾节点
            Node t = tail;
            if (t == null) {
                //如果尾节点为空，创建哨兵节点，通过cas把头节点指向哨兵节点
                if (compareAndSetHead(new Node()))
                    //cas成功，尾节点指向哨兵节点
                    tail = head;
            } else {
                //当前节点的前驱节点设指向之前尾节点
                node.prev = t;
                //cas设置把尾节点指向当前节点
                if (compareAndSetTail(t, node)) {
                    //cas成功，之前尾节点的下个节点指向当前节点
                    t.next = node;
                    return t;
                }
            }
        }
    }
```

![图片](images/WX20210725-165411@2-7x.png)

出队：CLH队列中的节点都是获取资源失败的线程节点，当持有资源的线程释放资源时，会将head.next指向的线程节点唤醒（CLH队列的第二个节点），如果唤醒的线程节点获取资源成功，线程节点清空信息设置为头部节点（新哨兵节点）。只需要关注1~3步骤即可，过程非常简单，假设获取资源成功，更换头部节点，并把头部节点的信息清除变成哨兵节点，注意这个过程是不需要使用C A S来保证，因为只有一个线程能够成功获取到资源。

```
//acquireQueued函数中的部分代码
//1.获取前驱节点
final Node p = node.predecessor();
//如果前驱节点是首节点，获取资源（子类实现）
if (p == head && tryAcquire(arg)) {
    //2.获取资源成功，设置当前节点为头节点，清空当前节点的信息，把当前节点变成哨兵节点
    setHead(node);
    //3.原来首节点下个节点指向为null
    p.next = null; // help GC
    //4.非异常状态，防止指向finally逻辑
    failed = false;
    //5.返回线程中断状态
    return interrupted;
}

private void setHead(Node node) {
    //节点设置为头部
    head = node;
    //清空线程
    node.thread = null;
    //清空前驱节点
    node.prev = null;
}
```

![图片](images/WX20210725-165411@2-8x.png)

##### 4.5 **条件变量**

> 这篇不错很不错：https://mp.weixin.qq.com/s/z4IP1UE-bxwzoTLNONYbBw

![图片](images/WX20210725-165411@2-10x.png)

条件变量中是阻塞的线程，CHL队列中是参与竞争的线程（类似于自旋），和Synchronize不同的是AQS可以有很多个条件变量。AbstractQueuedSynchronizer类中包含一个内部类ConditionObject，该类实现了Condition的接口。一个Condition对象包含一个等待队列，同时Condition对象可以实现等待/通知功能。如果当前线程调用Condition.await()时，会将当前线程信息构建一个Node节点，因为Condition持有等待队列中的首尾节点，所以将当前等待队列中的尾节点的nextWaiter指向当前线程构建的节点，同时更新lastWaiter的引用节点。上述过程中的节点、队列的操作，是获取到锁的线程来调用Condition.await()的，所以整个执行过程在没有基于 CAS 的情况下，也是线程安全的。

Object的wait、notify函数是配合Synchronized锁实现线程间同步协作的功能，AQS的ConditionObject条件变量也提供这样的功能，通过ConditionObject的await和signal两类函数完成。不同于Synchronized锁，一个AQS可以对应多个条件变量，而Synchronized只有一个。ConditionObject内部维护着一个单向条件队列，不同于CHL队列，**条件队列只入队执行await的线程节点**，**并且加入条件队列的节点，不能在CHL队列**， 条件队列出队的节点，会入队到CHL队列。当某个线程执行了ConditionObject的await函数，阻塞当前线程，线程会被封装成Node节点添加到条件队列的末端，其他线程执行ConditionObject的signal函数，会将条件队列头部线程节点转移到CHL队列参与竞争资源，具体流程如下图

![图片](images/WX20210725-165411@2-9x.png)

**CHL队列和ConditonObject的关系**

> 引用自：https://www.cmsblogs.com/article/1391297860124938240
可以通过这段代码理解：

```
    public class ConditionTest {
        private LinkedList<String> buffer;    //容器
        private int maxSize ;           //容器最大
        private Lock lock;
        private Condition fullCondition;
        private Condition notFullCondition;
    
        ConditionTest(int maxSize){
            this.maxSize = maxSize;
            buffer = new LinkedList<String>();
            lock = new ReentrantLock();
            fullCondition = lock.newCondition();
            notFullCondition = lock.newCondition();
        }
    
        public void set(String string) throws InterruptedException {
        	//获取锁。这块就是CHL队列执行的地方，获取到锁会执行下边的内容，获取不到锁就会进入队列通过自旋转的方式获取锁
            lock.lock();    
            try {
                while (maxSize == buffer.size()){
                	//满了，添加的线程进入等待状态。这个就是条件队列执行的地方，虽然线程拿到锁了，但也不一定会执行
                	//如果没有资源就会进入到条件队列里，通过signal唤醒之后，再次尝试获取锁，获取成功之后，才执行代码。
                    notFullCondition.await();
                }
    
                buffer.add(string);
                fullCondition.signal();
            } finally {
                lock.unlock();      //记得释放锁
            }
        }
    
        public String get() throws InterruptedException {
            String string;
            lock.lock();
            try {
                while (buffer.size() == 0){
                    fullCondition.await();
                }
                string = buffer.poll();
                notFullCondition.signal();
            } finally {
                lock.unlock();
            }
            return string;
        }
    }
```

##### 4.6 **设计思想**

> 引用自：https://mp.weixin.qq.com/s/cJ0t1vQGzBe6AnaB8sYXaA

核心设计思路：AQS提供一个框架，用于实现依赖于CLH队列的阻塞锁和相关的并发同步器。子类通过实现判定是否能获取/释放资源的protect方法，AQS基于这些protect方法实现对线程的排队、唤醒的线程调度策略。AQS还提供一个支持线程安全原子更新的int类型变量作为同步状态值(state)，子类可以根据实际需求，灵活定义该变量代表的意义进行更新。

AQS的设计使用了模板方法的设计模式，模板方法一般在父类中封装不变的部分（如算法骨架），把扩展的可变部分交给子类进行扩展，子类的执行结果会影响父类的结果，是一种反向的控制结构。AQS中应用了这种设计模式，将一部分方法交给子类进行重写，而自定义的同步组件在调用同步器提供的模板方法（父类中的方法）时，又会调用子类重写的方法。

以AQS类中常用于获取锁的acquire方法为例，acquire方法被final修饰，不可以在子类中重写，因为它是对外提供的模板方法，有相对具体和固定的执行逻辑。可以看到带有protected修饰的tryAcquire方法是一个空壳方法，并没有定义实际获取同步状态的逻辑，这就需要我们在继承AQS的子类中对齐进行重写，从而达到扩展目的。在重写过程中，就会用到上面提到的获取和修改同步状态的3个方法getState、setState和compareAndSetState。

可以看到带有protected修饰的tryAcquire方法是一个空壳方法，并没有定义实际获取同步状态的逻辑，这就需要我们在继承AQS的子类中对齐进行重写，从而达到扩展目的。在重写过程中，就会用到上面提到的获取和修改同步状态的3个方法getState、setState和compareAndSetState。以ReentrantLock中的方法调用为例，当调用ReentrantLock中的lock方法时，会调用继承了AQS的内部类Sync的父类中的acquire方法，acquire方法再调用子类Sync的tryAcquire方法并返回boolean类型结果。

除了tryAcquire方法外，子类中还提供了其他可以重写的方法，列出如下：

- tryAcquire：独占式获取同步状态
- tryRelease：独占式释放同步状态
- tryAcquireShared：共享式获取同步状态
- tryReleaseShared：共享式释放同步状态
- isHeldExclusively：当前线程是否独占式的占用同步状态

而我们在实现自定义的同步组件时，可以直接调用AQS提供的下面这些模板方法：

- acquire：独占式获取同步状态，如果线程获取同步状态成功那么方法返回，否则线程阻塞，进入同步队列中
- acquireInterruptibly：在acquire基础上，添加了响应中断功能
- tryAcquireNanos：在acquireInterruptibly基础上，添加了超时限制，超时会返回false
- acquireShared：共享式获取同步状态，如果线程获取同步状态成功那么方法返回，否则线程进入同步队列中阻塞。与acquire不同，该方法允许多个线程同时获取锁
- acquireSharedInterruptibly：在acquireShared基础上，可响应中断
- tryAcquireSharedNanos：在acquireSharedInterruptibly基础上，添加了超时限制
- release：独占式释放同步状态，将唤醒同步队列中第一个节点的线程
- releaseShared：共享式释放同步状态
- getQueuedThreads：获取等待在同步队列上的线程集合

从模板方法中可以看出，大多方法都是独占模式和共享模式对称出现的，除去查询等待线程方法外，可以将他们分为两类：独占式获取或释放同步状态、共享式获取或释放同步状态，并且它们的核心都是acquire与release方法，其他方法只是在它们实现的基础上做了部分的逻辑改动，增加了中断和超时功能的支持。下面对主要的4个方法进行分析。

![图片](images/WX20210725-165411@2-11x.png)


**4.6.1 显式获取**
该特性还是以ReentrantLock锁为例，ReentrantLock是可重入对象锁，线程每次请求获取成功一次锁，同步状态值state加1，释放锁state减1，state为0代表没有任何线程持有锁，ReentrantLock锁支持公平/非公平特性，下面的显式获取特性以公平锁为例

**4.6.1.1 阻塞等待获取**

基本实现如下：

- ReentrantLock实现AQS的tryAcquire(int)方法，先判断：如果没有任何线程持有锁，或者当前线程已经持有锁，则返回true，否则返回false
- AQS的acquire(int)方法判断当前节点是否为head且基于tryAcquire(int)能否获得资源，如果不能获得，则加入CLH队列排队阻塞等待
- ReentrantLock的lock()方法基于AQS的acquire(int)方法阻塞等待获取锁

ReentrantLock中的tryAcquire(int)方法实现：

```
protected final boolean tryAcquire(int acquires) {
	final Thread current = Thread.currentThread();
	int c = getState();
    // 没有任何线程持有锁
	if (c == 0) {
        // 通过CLH队列的head判断没有别的线程在比当前更早acquires
        // 且基于CAS设置state成功(期望的state旧值为0)
		if (!hasQueuedPredecessors() &&
			compareAndSetState(0, acquires)) {
            // 设置持有锁的线程为当前线程
			setExclusiveOwnerThread(current);
			return true;
		}
	}
    // 持有锁的线程为当前线程
	else if (current == getExclusiveOwnerThread()) {
        // 仅仅在当前线程，单线程，不用基于CAS更新
		int nextc = c + acquires;
		if (nextc < 0)
			throw new Error("Maximum lock count exceeded");
		setState(nextc);
		return true;
	}
    // 其他线程已经持有锁
	return false;
}
```

AQS的acquire(int)方法实现

```
public final void acquire(int arg) {
        // tryAcquire检查释放能获取成功
        // addWaiter 构建CLH的节点对象并入队
        // acquireQueued线程阻塞等待
	if (!tryAcquire(arg) &&
		acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
        // acquireQueued返回true，代表线程在获取资源的过程中被中断
        // 则调用该方法将线程中断标志位设置为true
		selfInterrupt();
}


final boolean acquireQueued(final Node node, int arg) {
    // 标记是否成功拿到资源
	boolean failed = true;
	try {
	    // 标记等待过程中是否被中断过
		boolean interrupted = false;
		// 循环直到资源释放
		for (;;) {
		    // 拿到前驱节点
			final Node p = node.predecessor();
			
			// 如果前驱是head，即本节点是第二个节点，才有资格去尝试获取资源
			// 可能是head释放完资源唤醒本节点，也可能被interrupt()
			if (p == head && tryAcquire(arg)) {
			    // 成功获取资源
				setHead(node);
				// help GC
				p.next = null;
				failed = false;
				return interrupted;
			}
			
			// 需要排队阻塞等待
			// 如果在过程中线程中断，不响应中断
			// 且继续排队获取资源，设置interrupted变量为true
			if (shouldParkAfterFailedAcquire(p, node) &&
				parkAndCheckInterrupt())
				interrupted = true;
		}
	} finally {
		if (failed)
			cancelAcquire(node);
	}
}
```
**4.6.1.2 无阻塞尝试获取**

ReentrantLock中的tryLock()的实现仅仅是非公平锁实现，实现逻辑基本与tryAcquire一致，不同的是没有通过hasQueuedPredecessors()检查CLH队列的head是否有其他线程在等待，这样当资源释放时，有线程请求资源能插队优先获取

ReentrantLock中tryLock()具体实现如下：

```
public boolean tryLock() {
	return sync.nonfairTryAcquire(1);
}

final boolean nonfairTryAcquire(int acquires) {
	final Thread current = Thread.currentThread();
	int c = getState();
	// 没有任何线程持有锁
	if (c == 0) {
	    // 基于CAS设置state成功(期望的state旧值为0)
		// 没有检查CLH队列中是否有线程在等待
		if (compareAndSetState(0, acquires)) {
			setExclusiveOwnerThread(current);
			return true;
		}
	}
	// 持有锁的线程为当前线程
	else if (current == getExclusiveOwnerThread()) {
	    // 仅仅在当前线程，单线程，不用基于CAS更新
		int nextc = c + acquires;
		if (nextc < 0) // overflow，整数溢出
			throw new Error("Maximum lock count exceeded");
		setState(nextc);
		return true;
	}
	// 其他线程已经持有锁
	return false;
}
```

**4.6.1.3 指定时间内阻塞等待获取**

基本实现如下：

- ReentrantLock的tryLock(long, TimeUnit)调用AQS的tryAcquireNanos(int, long)方法
- AQS的tryAcquireNanos先调用tryAcquire(int)尝试获取，获取不到再调用doAcquireNanos(int, long)方法
- AQS的doAcquireNanos判断当前节点是否为head且基于tryAcquire(int)能否获得资源，如果不能获得且超时时间大于1微秒，则休眠一段时间后再尝试获取

ReentrantLock中的实现如下：

```
public boolean tryLock(long timeout, TimeUnit unit)
		throws InterruptedException {
	return sync.tryAcquireNanos(1, unit.toNanos(timeout));
}

public final boolean tryAcquireNanos(int arg, long nanosTimeout)
		throws InterruptedException {
	// 如果线程已经被interrupt()方法设置中断	
	if (Thread.interrupted())
		throw new InterruptedException();
	// 先tryAcquire尝试获取锁	
	return tryAcquire(arg) ||
		doAcquireNanos(arg, nanosTimeout);
}
AQS中的实现如下：

private boolean doAcquireNanos(int arg, long nanosTimeout)
		throws InterruptedException {
	if (nanosTimeout <= 0L)
		return false;
	// 获取到资源的截止时间	
	final long deadline = System.nanoTime() + nanosTimeout;
	final Node node = addWaiter(Node.EXCLUSIVE);
	// 标记是否成功拿到资源
	boolean failed = true;
	try {
		for (;;) {
		    // 拿到前驱节点
			final Node p = node.predecessor();
			// 如果前驱是head，即本节点是第二个节点，才有资格去尝试获取资源
            // 可能是head释放完资源唤醒本节点，也可能被interrupt()
			if (p == head && tryAcquire(arg)) {
			    // 成功获取资源
				setHead(node);
				// help GC
				p.next = null;
				failed = false;
				return true;
			}
			// 更新剩余超时时间
			nanosTimeout = deadline - System.nanoTime();
			if (nanosTimeout <= 0L)
				return false;
			// 排队是否需要排队阻塞等待	
			// 且超时时间大于1微秒，则线程休眠到超时时间到了再尝试获取
			if (shouldParkAfterFailedAcquire(p, node) &&
				nanosTimeout > spinForTimeoutThreshold)
				LockSupport.parkNanos(this, nanosTimeout);

			// 如果线程已经被interrupt()方法设置中断
			// 则不再排队，直接退出	
			if (Thread.interrupted())
				throw new InterruptedException();
		}
	} finally {
		if (failed)
			cancelAcquire(node);
	}
}

```

**4.6.1.4 响应中断获取取**

ReentrantLock响应中断获取锁的方式是：当线程在park方法休眠中响应thead.interrupt()方法中断唤醒时，检查到线程中断标志位为true，主动抛出异常，核心实现在AQS的doAcquireInterruptibly(int)方法中基本实现与阻塞等待获取类似，只是调用从AQS的acquire(int)方法，改为调用AQS的doAcquireInterruptibly(int)方法

```
private void doAcquireInterruptibly(int arg)
	throws InterruptedException {
	final Node node = addWaiter(Node.EXCLUSIVE);
	// 标记是否成功拿到资源
	boolean failed = true;
	try {
		for (;;) {
		    // 拿到前驱节点
			final Node p = node.predecessor();
			
			// 如果前驱是head，即本节点是第二个节点，才有资格去尝试获取资源
			// 可能是head释放完资源唤醒本节点，也可能被interrupt()
			if (p == head && tryAcquire(arg)) {
			    // 成功获取资源
				setHead(node);
				p.next = null; // help GC
				failed = false;
				return;
			}
			
			// 需要排队阻塞等待
			if (shouldParkAfterFailedAcquire(p, node) &&
			    // 从排队阻塞中唤醒，如果检查到中断标志位为true
				parkAndCheckInterrupt())
				// 主动响应中断
				throw new InterruptedException();
		}
	} finally {
		if (failed)
			cancelAcquire(node);
	}
}
```

**4.6.2 显式释放**

AQS资源共享方式分为独占式和共享式，这里先以ReentrantLock为例介绍独占式资源的显式释放，共享式后面会介绍到，与显式获取有类似之处，ReentrantLock显式释放基本实现如下：

- ReentrantLock实现AQS的tryRelease(int)方法，方法将state变量减1，如果state变成0代表没有任何线程持有锁，返回true，否则返回false
- AQS的release(int)方法基于tryRelease(int)排队是否有任何线程持有资源，如果没有，则唤醒CLH队列中头节点的线程
- 被唤醒后的线程继续执行acquireQueued(Node,int)或者doAcquireNanos(int, long)或者doAcquireInterruptibly(int)中for(;;)中的逻辑，继续尝试获取资源

ReentrantLock中tryRelease(int)方法实现如下：

```
protected final boolean tryRelease(int releases) {
	int c = getState() - releases;
	// 只有持有锁的线程才有资格释放锁
	if (Thread.currentThread() != getExclusiveOwnerThread())
		throw new IllegalMonitorStateException();
		
	// 标识是否没有任何线程持有锁	
	boolean free = false;
	
	// 没有任何线程持有锁
	// 可重入锁每lock一次都需要对应一次unlock
	if (c == 0) {
		free = true;
		setExclusiveOwnerThread(null);
	}
	setState(c);
	return free;
}
AQS中的release(int)方法实现如下：

public final boolean release(int arg) {
    // 尝试释放资源
	if (tryRelease(arg)) {
		Node h = head;
		// 头节点不为空
		// 后继节点入队后进入休眠状态之前，会将前驱节点的状态更新为SIGNAL(-1)
		// 头节点状态为0，代表没有后继的等待节点
		if (h != null && h.waitStatus != 0)
		    // 唤醒第二个节点
		    // 头节点是占用资源的线程，第二个节点才是首个等待资源的线程
			unparkSuccessor(h);
		return true;
	}
	return false;
}
```


**4.6.3 可重入**

可重入的实现比较简单，以ReentrantLock为例，主要是在tryAcquire(int)方法中实现，持有锁的线程是不是当前线程，如果是，更新同步状态值state，增加state+1，并返回true，代表能获取锁。

**4.6.4 可共享**

可共享资源以ReentrantReadWriteLock为例，跟独占锁ReentrantLock的区别主要在于，获取的时候，多个线程允许共享读锁，当写锁释放时，多个阻塞等待读锁的线程能同时获取到。ReentrantReadWriteLock类中将AQS的state同步状态值定义为，高16位为读锁持有数，低16位为写锁持有锁。ReentrantReadWriteLock中tryAcquireShared(int)、tryReleaseShared(int)实现的逻辑较长，主要涉及读写互斥、可重入判断、读锁对写锁的让步，篇幅所限，这里就不展开了。获取读锁(ReadLock.lock())主要实现如下：

- ReentrantReadWriteLock实现AQS的tryAcquireShared(int)方法，判断当前线程能否获得读锁
- AQS的acquireShared(int)先基于tryAcquireShared(int)尝试获取资源，如果获取失败，则加入CLH队列排队阻塞等待
- ReentrantReadWriteLock的ReadLock.lock()方法基于AQS的acquireShared(int)方法阻塞等待获取锁

AQS中共享模式获取资源的具体实现如下：

```
public final void acquireShared(int arg) {
    // tryAcquireShared返回负数代表获取共享资源失败
	// 则通过进入等待队列，直到获取到资源为止才返回
	if (tryAcquireShared(arg) < 0)
		doAcquireShared(arg);
}

// 与前面介绍到的acquireQueued逻辑基本一致
// 不同的是将tryAcquire改为tryAcquireShared
// 还有资源获取成功后将传播给CLH队列上等待该资源的节点
private void doAcquireShared(int arg) {
	final Node node = addWaiter(Node.SHARED);
	 // 标记是否成功拿到资源
	boolean failed = true;
	try {
		boolean interrupted = false;
		for (;;) {
			final Node p = node.predecessor();
			if (p == head) {
				int r = tryAcquireShared(arg);
				// 资源获取成功
				if (r >= 0) {
 				    // 传播给CLH队列上等待该资源的节点
					setHeadAndPropagate(node, r);
					p.next = null; // help GC
					if (interrupted)
						selfInterrupt();
					failed = false;
					return;
				}
			}
			// 需要排队阻塞等待
            // 如果在过程中线程中断，不响应中断
            // 且继续排队获取资源，设置interrupted变量为true
			if (shouldParkAfterFailedAcquire(p, node) &&
				parkAndCheckInterrupt())
				interrupted = true;
		}
	} finally {
		if (failed)
			cancelAcquire(node);
	}
}

//  资源传播给CLH队列上等待该资源的节点
private void setHeadAndPropagate(Node node, int propagate) {
	Node h = head;
	setHead(node);
	if (propagate > 0 || h == null || h.waitStatus < 0 ||
		(h = head) == null || h.waitStatus < 0) {
		Node s = node.next;
		if (s == null || s.isShared())
		    // 释放共享资源
			doReleaseShared();
	}
}
```

释放读锁(ReadLock.unlock())主要实现如下：ReentrantReadWriteLock中共享资源的释放主要实现如下：

- ReentrantReadWriteLock实现AQS的tryReleaseShared(int)方法，判断读锁释放后是否还有线程持有读锁
- AQS的releaseShared(int)基于tryReleaseShared(int)判断是否需要CLH队列中的休眠线程，如果需要就执行doReleaseShared()
- ReentrantReadWriteLock的ReadLock.unlock()方法基于AQS的releaseShared(int)方法释放锁

AQS中共享模式释放资源具体实现如下：

```
public final boolean releaseShared(int arg) {
    // 允许唤醒CLH中的休眠线程
	if (tryReleaseShared(arg)) {
	    // 执行资源释放
		doReleaseShared();
		return true;
	}
	return false;
}
	
private void doReleaseShared() {
	for (;;) {
		Node h = head;
		if (h != null && h != tail) {
			int ws = h.waitStatus;
			// 当前节点正在等待资源
			if (ws == Node.SIGNAL) {
			    // 当前节点被其他线程唤醒了
				if (!compareAndSetWaitStatus(h, Node.SIGNAL, 0))
					continue;
				unparkSuccessor(h);
			}
			// 进入else的条件是，当前节点刚刚成为头节点
			// 尾节点刚刚加入CLH队列，还没在休眠前将前驱节点状态改为SIGNAL
			// CAS失败是尾节点已经在休眠前将前驱节点状态改为SIGNAL
			else if (ws == 0 &&
					 !compareAndSetWaitStatus(h, 0, Node.PROPAGATE))
				continue;
		}
		// 每次唤醒后驱节点后，线程进入doAcquireShared方法，然后更新head
		// 如果h变量在本轮循环中没有被改变，说明head == tail，队列中节点全部被唤醒
		if (h == head)
			break;
	}
}
```

**4.6.5 公平、非公平**

这个特性实现比较简单，以ReentrantLock锁为例，公平锁直接基于AQS的acquire(int)获取资源，而非公平锁先尝试插队：基于CAS，期望state同步变量值为0(没有任何线程持有锁)，更新为1，如果CAS更新失败在进行排队

```
// 公平锁实现
final void lock() {
	acquire(1);
}

// 非公平锁实现
final void lock() {
    // state值为0代表没有任何线程持有锁，直接插队获得锁
	if (compareAndSetState(0, 1))
		setExclusiveOwnerThread(Thread.currentThread());
	else
		acquire(1);
}
```


#### 5. ReentrantLock


> 引用自：https://mp.weixin.qq.com/s/ks1-_tsTdWm1FEux42rgZw

> 这个也不错：https://blog.csdn.net/fh667788123/article/details/105090530

在JDK1.5以前，锁的实现只能用synchronized关键字；1.5开始提供了ReentrantLock，它是API层面的锁。它的结构如下：

![图片](images/WX20210822-151155@2x-1.png)

Lock接口定义的函数不多，接下来ReentrantLock要去实现这些函数，遵循着解耦可扩展设计，ReentrantLock内部定义了专门的组件Sync，Sync继承AbstractQueuedSynchronizer提供释放资源的实现，NonfairSync和FairSync是基于Sync扩展的子类，即ReentrantLock的非公平模式与公平模式，它们作为Lock接口功能的基本实现。ReentrantLock类中带有两个构造函数，一个是默认的构造函数，不带任何参数；一个是带有 fair 参数的构造函数。
```
public ReentrantLock() {
  sync = new NonfairSync();
}

public ReentrantLock(boolean fair) {
  sync = fair ? new FairSync() : new NonfairSync();
}
```
第二个构造函数也是判断 ReentrantLock 是否是公平锁的条件，如果 fair 为 true，则会创建一个公平锁的实现，也就是 new FairSync()，如果 fair 为 false，则会创建一个 非公平锁的实现，也就是 new NonfairSync()，默认的情况下创建的是非公平锁。


**为什么是重入锁**在ReentrantLock中，它对AbstractQueuedSynchronizer的state状态值定义为线程获取该锁的重入次数，state状态值为0表示当前没有被任何线程持有，state状态值为1表示被其他线程持有，因为支持可重入，如果是持有锁的线程，再次获取同一把锁，直接成功，并且state状态值+1，线程释放锁state状态值-1，同理重入多次锁的线程，需要释放相应的次数。

##### 5.1 Sync
Sync可以说是ReentrantLock的亲儿子，它寄托了全村的希望，完美的继承了AbstractQueuedSynchronizer，是ReentrantLock的核心，后面的NonfairSync与FairSync都是基于Sync扩展出来的子类。

```
abstract static class Sync extends AbstractQueuedSynchronizer {
        private static final long serialVersionUID = -5179523762034025860L;

        /**
         * 获取锁-子类实现
         */
        abstract void lock();

        /**
         * 非公平-获取资源
         */
        final boolean nonfairTryAcquire(int acquires) {
            //获取当前线程
            final Thread current = Thread.currentThread();
            //获取当前状态
            int c = getState();
            if (c == 0) { // state==0 代表资源可获取
                //cas设置state为acquires，acquires传入的是1
                if (compareAndSetState(0, acquires)) {
                    //cas成功，设置当前持有锁的线程
                    setExclusiveOwnerThread(current);
                    //返回成功
                    return true;
                }
            }
            else if (current == getExclusiveOwnerThread()) { //如果state!=0,但是当前线程是持有锁线程，直接重入
                //state状态+1
                int nextc = c + acquires;
                if (nextc < 0) // overflow
                    throw new Error("Maximum lock count exceeded");
                //设置state状态，此处不需要cas，因为持有锁的线程只有一个    
                setState(nextc);
                //返回成功
                return true;
            }
            //返回失败
            return false;
        }
        
        /**
         * 释放资源
         */
        protected final boolean tryRelease(int releases) {
            //state状态-releases，releases传入的是1
            int c = getState() - releases;
            if (Thread.currentThread() != getExclusiveOwnerThread()) //如果当前线程不是持有锁线程，抛出异常
                throw new IllegalMonitorStateException();
            //设置返回状态，默认为失败
            boolean free = false;
            if (c == 0) {//state-1后，如果c==0代表释放资源成功
                //返回状态设置为true
                free = true;
                //清空持有锁线程
                setExclusiveOwnerThread(null);
            }
            //如果state-1后，state还是>0，代表当前线程有锁重入操作，需要做相应的释放次数，设置state值
            setState(c);
            return free;
        }
}        
```
Sync实现释放资源的细节（A Q S留给子类实现的tryRelease），然后声明了获取锁的抽象函数（lock），子类根据业务实现，目前看来还是很公平，但是Sync还定义了一个nonfairTryAcquire函数，这个函数是专门给NonfairSync使用的，FairSync却没有这种待遇，所以说Sync偏心。

##### 5.2 NonfairSync

AQS为加锁和解锁过程提供了统一的模板函数，加锁与解锁的模板流程是，获取锁失败的线程，会进入CLH队列阻塞，其他线程解锁会唤醒CLH队列线程。线程释放锁时，会唤醒CLH队列阻塞的线程，重新竞争锁，要注意，此时可能还有非CLH队列的线程参与竞争，所以非公平就体现在这里，非CLH队列线程与CLH队列线程竞争，各凭本事，不会因为你是CLH队列的线程，排了很久的队，就把锁让给你。

```
static final class NonfairSync extends Sync {
        private static final long serialVersionUID = 7316153563782823691L;

        /**
         * 获取锁
         */
        final void lock() {
            if (compareAndSetState(0, 1))//cas设置state为1成功，代表获取资源成功    
                //资源获取成功，设置当前线程为持有锁线程
                setExclusiveOwnerThread(Thread.currentThread());
            else
                //cas设置state为1失败，代表获取资源失败，执行AQS获取锁模板流程，否获取资源成功
                acquire(1);
        }
        
        /**
         * 获取资源-使用的是Sync提供的nonfairTryAcquire函数
         */
        protected final boolean tryAcquire(int acquires) {
            return nonfairTryAcquire(acquires);
        }
    }
    
    /**
     * AQS获取锁模板函数，这是AQS类中的函数
     */
    public final void acquire(int arg) {
        /**
         * 我们只需要关注tryAcquire函数，后面的函数是AQS获取资源失败，线程节点进入CLH队列的细节流程，本文不关注
         */
        if (!tryAcquire(arg) &&
            acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
            selfInterrupt();
    }
```

NonfairSync继承Sync实现了lock函数，lock函数也非常简单，CAS设置状态值state为1代表获取锁成功，否则执行AQS的acquire函数（获取锁模板），另外NonfairSync还实现了AQS留给子类实现的tryAcquire函数（获取资源），这个被Sync宠幸的幸运儿，直接使用Sync提供的nonfairTryAcquire函数来实现tryAcquire，最后子类实现的tryAcquire函数在AQS的acquire函数中被使用。首先AQS的acquire函数是获取锁的流程模板，模板流程会先执行tryAcquire函数获取资源，tryAcquire函数要子类实现，NonfairSync作为子类，实现了tryAcquire函数，具体实现是调用了Sync的nonfairTryAcquire函数。

- 可获取，尝试使用C A S设置state为1，C A S成功代表获取资源成功，否则获取资源失败
- 不可获取，判断当线程是不是持有锁的线程，如果是，state重入计数，获取资源成功，否则获取资源失败

##### 5.3 FairSync

公平策略就是，严格按照CLH队列顺序获取锁，线程释放锁时，会唤醒CLH队列阻塞的线程，重新竞争锁，要注意，此时可能还有非CLH队列的线程参与竞争，为了保证公平，一定会让CLH队列线程竞争成功，如果非CLH队列线程一直占用时间片，那就一直失败（构建成节点插入到CLH队尾，由A S Q模板流程执行），直到时间片轮到CLH队列线程为止，所以公平策略的性能会更差。

![图片](images/WX20210822-151155@2x-2.png)

```
static final class FairSync extends Sync {
        private static final long serialVersionUID = -3000897897090466540L;
        
        /**
         * 获取锁
         */
        final void lock() {
        //cas设置state为1失败，代表获取资源失败，执行AQS获取锁模板流程，否获取资源成功
            acquire(1);
        }

        /**
         * 获取资源
         */
        protected final boolean tryAcquire(int acquires) {
            //获取当前线程
            final Thread current = Thread.currentThread();
            //获取state状态
            int c = getState();
            if (c == 0) { // state==0 代表资源可获取
                //1.hasQueuedPredecessors判断当前线程是不是CLH队列被唤醒的线程，如果是执行下一个步骤
               //2.cas设置state为acquires，acquires传入的是1
                if (!hasQueuedPredecessors() &&
                    compareAndSetState(0, acquires)) {
                    //cas成功，设置当前持有锁的线程
                    setExclusiveOwnerThread(current);
                    //返回成功
                    return true;
                }
            }
            //如果state!=0,但是当前线程是持有锁线程，直接重入
            else if (current == getExclusiveOwnerThread()) {
                //state状态+1
                int nextc = c + acquires;
                if (nextc < 0)
                    throw new Error("Maximum lock count exceeded");
                //设置state状态，此处不需要cas，因为持有锁的线程只有一个 
                setState(nextc);
                //返回成功
                return true;
            }
            return false;
        }
    }

    /**
     * AQS获取锁模板函数，这是AQS类中的函数
     */
    public final void acquire(int arg) {
        /**
         * 我们只需要关注tryAcquire函数，后面的函数是AQS获取资源失败，线程节点进入CLH队列的细节流程，本文不关注
         */
        if (!tryAcquire(arg) &&
            acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
            selfInterrupt();
    }
```


其实我们不难发现FairSync流程与NonfairSync基本一致，唯一的区别就是在CAS执行前，多了一步hasQueuedPredecessors函数，这一步就是判断当前线程是不是CLH队列被唤醒的线程，如果是就执行CAS，否则获取资源失败.

ReentrantLock默认是使用非公平策略，如果想指定模式，可以通过入参fair来选择，这里就不做过多概述，接下来看看ReentrantLock对Lock的实现。
```
public class ReentrantLock implements Lock, java.io.Serializable {
    private static final long serialVersionUID = 7373984872572414699L;
    //同步器
    private final Sync sync;

    //默认使用非公平策略
    public ReentrantLock() {
        sync = new NonfairSync();
    }

    //true-公平策略 false非公平策略
    public ReentrantLock(boolean fair) {
        sync = fair ? new FairSync() : new NonfairSync();
    }

    /**
     * 获取锁-阻塞
     */
    public void lock() {
        //基于sync实现
        sync.lock();
    }

    /**
     * 获取锁-阻塞，支持响应线程中断
     */
    public void lockInterruptibly() throws InterruptedException {
        //基于sync实现
        sync.acquireInterruptibly(1);
    }

    /**
     * 获取资源，返回是否成功状态-非阻塞
     */
    public boolean tryLock() {
        //基于sync实现
        return sync.nonfairTryAcquire(1);
    }

    /**
     * 获取锁-阻塞，支持超时 
     */
    public boolean tryLock(long timeout, TimeUnit unit)
            throws InterruptedException {
        //基于sync实现    
        return sync.tryAcquireNanos(1, unit.toNanos(timeout));
    }

    /**
     * 释放锁
     */
    public void unlock() {
        //基于sync实现
        sync.release(1);
    }

    /**
     * 创建条件变量
     */
    public Condition newCondition() {
        //基于sync实现
        return sync.newCondition();
    }

}
```
ReentrantLock对Lock的实现都是基于Sync来做的，有一种神器在手，天下我有的风范。Sync承包了所有事情，为何它如此牛皮，因为Sync上有AbstractQueuedSynchronizer老大哥罩着，下有NonfairSync与FairSync两小弟可差遣，所以成为ReentrantLock的利器也合情合理。


#### 6. ReentrantReadWriteLock

> 引用自：https://mp.weixin.qq.com/s/4-U7SpexOR331zVd3FnWuQ

有了CopyOnWrite为何又要有ReadWriteLock？

- 内存占用问题：因为CopyOnWrite的写时复制机制每次进行写操作的时候都会有两个数组对象的内存，如果这个数组对象占用的内存较大的话，如果频繁的进行写入就会造成频繁的Yong GC和Full GC

- 数据一致性问题：CopyOnWrite容器只能保证数据的最终一致性，不能保证数据的实时一致性。读操作的线程可能不会立即读取到新修改的数据，因为修改操作发生在副本上。但最终修改操作会完成并更新容器所以这是最终一致性。当时有说到解决这两个缺点我们可以使用Collections.synchronizedList()来替代，找个无非就是对list的增删改查方法都加了synchronized实现。我们知道synchronized其实是一个独占锁 （排他锁），如果不知道什么是独占锁的可以看看这个文章《史上最全 Java 中各种锁的介绍》 里面基本上把java里面的锁都介绍完了。但是这样的话就会存在一个性能问题，如果对于读多写少的场景，每次读也要去获取锁，读完了之后再释放锁，这样就造成了每个读的请求都要进行获取锁，但是读的话并不会引起数据不安全，这样就会造成一个性能瓶颈。为了解决这个问题，就又出现了一种新的锁，读写锁(ReadWriteLock)。

读锁在同一时刻可以允许多个读线程获取，但是在写线程访问的时候，所有的读线程和其他写线程都会被阻塞。写锁同一时刻只能有一个写线程获取成功，其他都会被阻塞。读写锁实际维护了两把锁，一个读锁和一个写锁，通过读锁和写锁进行区分，在读多写少的情况下并发性比独占锁有了很大的提升。在java里面对读写锁的实现就是ReentrantReadWriteLock，它有以下特性：

- 公平性：支持公平性和非公平性。
- 重入性：支持重入。读写锁最多支持65535个递归写入锁和65535个递归读取锁。
- 锁降级：遵循获取写锁、获取读锁在释放写锁的次序，写锁能够降级成为读锁。
- 读写锁除了读读不互斥，读写、写读、写写都是互斥的。

另外有一些原则：

- 多个线程可以同时进入同一个读锁
- 多个线程不能同时进入同一个写锁
- 多个线程不能同时进入同一对读锁、写锁
- 一个线程可以先进入写锁、再进入读锁
- 一个线程可以先进入写锁、再进入读锁、再进入写锁
- 一个线程不能先进入读锁、再进入写锁【这种情况会导致线程卡死】

![图片](images/WX20210822-151155@2x-3.png)

类图结构

![图片](images/WX20210822-151155@2x-4.png)


ReentrantReadWriteLock中的类分成三个部分：

- ReentrantReadWriteLock本身实现了ReadWriteLock接口，这个接口只提供了两个方法readLock()和writeLock（）；
- 同步器，包含一个继承了AQS的Sync内部类，以及其两个子类FairSync和NonfairSync；
- ReadLock和WriteLock两个内部类实现了Lock接口，它们具有锁的一些特性。

##### 6.1 读写锁的使用
```
 class RWDictionary {
   private final Map<String, Data> m = new TreeMap<String, Data>();
   private final ReentrantReadWriteLock rwl = new ReentrantReadWriteLock();
   private final Lock r = rwl.readLock();
   private final Lock w = rwl.writeLock();

   public Data get(String key) {
     r.lock();
     try { return m.get(key); }
     finally { r.unlock(); }
   }
   public String[] allKeys() {
     r.lock();
     try { return m.keySet().toArray(); }
     finally { r.unlock(); }
   }
   public Data put(String key, Data value) {
     w.lock();
     try { return m.put(key, value); }
     finally { w.unlock(); }
   }
   public void clear() {
     w.lock();
     try { m.clear(); }
     finally { w.unlock(); }
   }
 }
```

> 引用自：https://mp.weixin.qq.com/s/NvNWmqZzpbKGRLhBJq9GuA

##### 6.2 位运算

我们都知道AQS中维护了一个state状态变量，正常来说，维护读锁与写锁状态需要两个变量，但是为了节约资源，使用高低位切割实现state状态变量维护两种状态，即高16位表示读状态，低16位表示写状态。如果我们有看过线程池的源码，我们知道线程池的状态和线程数是通过一个int类型原子变量（高3位保存运行状态，低29位保存线程数）来控制的。

```
abstract static class Sync extends AbstractQueuedSynchronizer {
    // 下面这块说的就是将 state 一分为二，高 16 位用于共享模式，低16位用于独占模式
    static final int SHARED_SHIFT   = 16;
    static final int SHARED_UNIT    = (1 << SHARED_SHIFT);
    static final int MAX_COUNT      = (1 << SHARED_SHIFT) - 1;
    static final int EXCLUSIVE_MASK = (1 << SHARED_SHIFT) - 1;
    // 取 c 的高 16 位值，代表读锁的获取次数(包括重入)
    static int sharedCount(int c)    { return c >>> SHARED_SHIFT; }
    // 取 c 的低 16 位值，代表写锁的重入次数，因为写锁是独占模式
    static int exclusiveCount(int c) { return c & EXCLUSIVE_MASK; }

    // 这个嵌套类的实例用来记录每个线程持有的读锁数量(读锁重入)
    static final class HoldCounter {
        // 持有的读锁数
        int count = 0;
        // 线程 id
        final long tid = getThreadId(Thread.currentThread());
    }

    // ThreadLocal 的子类
    static final class ThreadLocalHoldCounter
        extends ThreadLocal<HoldCounter> {
        public HoldCounter initialValue() {
            return new HoldCounter();
        }
    }
    /**
      * 组合使用上面两个类，用一个 ThreadLocal 来记录当前线程持有的读锁数量
      */ 
    private transient ThreadLocalHoldCounter readHolds;

    // 用于缓存，记录"最后一个获取读锁的线程"的读锁重入次数，
    // 所以不管哪个线程获取到读锁后，就把这个值占为已用，这样就不用到 ThreadLocal 中查询 map 了
    // 算不上理论的依据：通常读锁的获取很快就会伴随着释放，
    //   显然，在 获取->释放 读锁这段时间，如果没有其他线程获取读锁的话，此缓存就能帮助提高性能
    private transient HoldCounter cachedHoldCounter;

    // 第一个获取读锁的线程(并且其未释放读锁)，以及它持有的读锁数量
    private transient Thread firstReader = null;
    private transient int firstReaderHoldCount;

    Sync() {
        // 初始化 readHolds 这个 ThreadLocal 属性
        readHolds = new ThreadLocalHoldCounter();
        // 为了保证 readHolds 的内存可见性
        setState(getState()); // ensures visibility of readHolds
    }
    ...
}
```
- state 的高 16 位代表读锁的获取次数，包括重入次数，获取到读锁一次加 1，释放掉读锁一次减 1
- state 的低 16 位代表写锁的获取次数，因为写锁是独占锁，同时只能被一个线程获得，所以它代表重入次数
- 每个线程都需要维护自己的 HoldCounter，记录该线程获取的读锁次数，这样才能知道到底是不是读锁重入，用 ThreadLocal 属性 readHolds 维护
- cachedHoldCounter 有什么用？其实没什么用，但能提示性能。将最后一次获取读锁的线程的 HoldCounter 缓存到这里，这样比使用 ThreadLocal 性能要好一些，因为 ThreadLocal 内部是基于 map 来查询的。但是 cachedHoldCounter 这一个属性毕竟只能缓存一个线程，所以它要起提升性能作用的依据就是：通常读锁的获取紧随着就是该读锁的释放。我这里可能表达不太好，但是大家应该是懂的吧。
- firstReader 和 firstReaderHoldCount 有什么用？其实也没什么用，但是它也能提示性能。将"第一个"获取读锁的线程记录在firstReader属性中，这里的第一个不是全局的概念，等这个firstReader当前代表的线程释放掉读锁以后，会有后来的线程占用这个属性的。firstReader 和 firstReaderHoldCount 使得在读锁不产生竞争的情况下，记录读锁重入次数非常方便快速
- 如果一个线程使用了 firstReader，那么它就不需要占用 cachedHoldCounter
- 个人认为，读写锁源码中最让初学者头疼的就是这几个用于提升性能的属性了，使得大家看得云里雾里的。主要是因为 ThreadLocal 内部是通过一个 ThreadLocalMap 来操作的，会增加检索时间。而很多场景下，执行 unlock 的线程往往就是刚刚最后一次执行 lock 的线程，中间可能没有其他线程进行 lock。还有就是很多不怎么会发生读锁竞争的场景。

> 引用自：https://mp.weixin.qq.com/s/NvNWmqZzpbKGRLhBJq9GuA

更好的解释：

读位运算：读锁使用高16位，每次获取读锁成功+1，所以读锁计数基本单位是1的高16位，即1左移16位（1 << 16）。1左移16位等于65536，每次获取读锁成功都+65536，这时有读者跳出来问，不是+1嘛，怎么变成+65536了，这不对啊。上面sharedCount函数通过位运算是做无符号右移16位获取读锁的重入数，为什么可以获取到呢？阿星原地向前走16步，再后退16步，又回到原点，1左移16位等于65536，65536右移16位等于1。比如我们获取到了3次读锁，就是65536 * 3 = 196608，转换下公式就是3左移16位等于196608，196608右移16位等于3。虽然我们每次获取到读锁都会+65536，但是获取读锁时会做右移16位，所以效果和+1是一样。

![图片](images/WX20210822-151155@2x-5.png)

写位运算：剩下的写锁就非常简单，获取低16位不用左右移动，只要把高16位全部补0即可。反推一下，因为不需要左右移动，其实就和正常的数字一样，只不过因为高16位补0，导致数值范围在0~65535，也就是说写锁获取成功直接+1就好了。

> 引用自：https://juejin.cn/post/6919722139583004686

##### 6.3 读锁获取

先看读锁操作readLock.lock(), 获取读取锁定，如果写锁未被另一个线程持有，则获取读锁并立即返回。如果写锁由另一个线程持有，将当前线程将被阻塞，并处于休眠状态，直到获取读锁为止。
```
public void lock() {
	sync.acquireShared(1);
}

public final void acquireShared(int arg) {
    if (tryAcquireShared(arg) < 0)
        doAcquireShared(arg);
}
```
以共享模式获取，此方法不支持中断。通过首先至少调用一次tryAcquireShared，并在成功后返回。否则，线程将排队，并可能反复阻塞和解除阻塞，并调用tryAcquireShared直到成功。返回负数表示获取失败；返回0表示成功，但是后继争用线程不会成功；返回正数表示获取成功，并且后继争用线程也可能成功。

![图片](images/WX20210822-151155@2x-6.png)

> 很优秀的文章：https://www.cxyzjd.com/article/u013634213/91040619

##### 6.3 写锁获取
```
//ReentrantReadWriteLock中的lock方法:

public void lock() {
	sync.acquire(1);
}

//AbstractQueuedSynchronizer中的acquire方法

public final void acquire(int arg) {
    // 获取锁失败则进入阻塞队列
	if (!tryAcquire(arg) &&
		acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
		selfInterrupt();
	}
}
```
![图片](images/WX20210822-151155@2x-7.png)

写锁的获取过程如下：

- 首先获取c、w。c表示当前锁状态；w表示写线程数量。然后判断同步状态state是否为0。如果state!=0，说明已经有其他线程获取了读锁或写锁。
- 如果锁状态不为零（c!=0），而写锁的状态为0（w=0），说明读锁此时被其他线程占用，所以当前线程不能获取写锁，自然返回false。或者锁状态不为零，而写锁的状态也不为0，但是获取写锁的线程不是当前线程，则当前线程也不能获取写锁。
- 判断当前线程获取写锁是否超过最大次数，若超过，抛异常，反之更新同步状态（此时当前线程已获取写锁，更新是线程安全的），返回true。
- 如果state为0，此时读锁或写锁都没有被获取，判断是否需要阻塞（公平和非公平方式实现不同），在非公平策略下总是不会被阻塞，在公平策略下会进行判断（判断同步队列中是否有等待时间更长的线程，若存在，则需要被阻塞，否则，无需阻塞），如果不需要阻塞，则CAS更新同步状态，若CAS成功则返回true，失败则说明锁被别的线程抢去了，返回false。如果需要阻塞则也返回false。
- 成功获取写锁后，将当前线程设置为占有写锁的线程，返回true。
- 获取锁失败的话，将当前线程进行放入阻塞队列中。


> 引用自：https://mp.weixin.qq.com/s/C_-bAm4A_x8kjoxGXKD6Dw
> 这个也不错：https://www.cnblogs.com/hongdada/p/11907015.html

##### 6.4 总结

在获取读锁时：

- 如果写锁已经被其他线程获取，那么此线程将会加入到同步队列，挂起等待唤醒。
- 如果写锁没有被其他线程获取，但是同步队列的第一个节点是写线程的节点，那么此线程让位给写线程，挂起等待唤醒
- 如果获取读锁的线程，已经持有了写锁，那么即使同步队列的第一个节点是写线程的节点，它也不会让位给同步队列中的写线程，而是自旋去获取读锁。因为此时让位会造成死锁

获取写锁时：

- 如果读锁已经被获取，那么不允许获取写锁。将此线程加入到同步队列，挂起等待唤醒
- 如果读锁没有被获取，但是写锁已经被其他线程抢占，那么还是将此线程加入到同步队列，挂起等待唤醒
- 如果写锁已经被此线程持有，那么重入，即写状态+1
- 如果读锁和写锁都没有被获取，那么CAS尝试获取写锁

> 引用自：https://mp.weixin.qq.com/s/ga3x8LYxDMgCzdfn6UUT_w

#### 7. CountDownLatch

在平时的开发中，会遇到在主线程中开启多个线程去并行执行任务的业务场景，并且主线程需要等待所有的子线程都执行完毕后，再执行主线程进行汇总。这个时候就可以使用CountDownLatch。

- 构造方法：CountDownLatch(int count)构造一个指定计数的CountDownLatch，count为线程将要等待的操作数。

```
    public CountDownLatch(int count) {
        if (count < 0) throw new IllegalArgumentException("count < 0");
        this.sync = new Sync(count);
    }

 private static final class Sync extends AbstractQueuedSynchronizer {
        private static final long serialVersionUID = 4982264981922014374L;
        Sync(int count) {
            setState(count);
        }
        //获取同步状态
        int getCount() {
            return getState();
        }
        //获取同步状态
        protected int tryAcquireShared(int acquires) {
            return (getState() == 0) ? 1 : -1;
        }
        //释放同步状态
        protected boolean tryReleaseShared(int releases) {
            for (;;) {
                int c = getState();
                if (c == 0)
                    return false;
                int nextc = c-1;
                if (compareAndSetState(c, nextc))
                    return nextc == 0;
            }
        }
    }
```
- await()：调用await方法后，使当前线程在锁存器(内部计数器)倒计数至零之前一直等待，进入休眠状态，除非线程被中断。如果当前计数递减为零，则此方法立即返回，继续执行。

```
    public void await() throws InterruptedException {
        sync.acquireSharedInterruptibly(1);
    }
```
- await(long timeout, TimeUnit unit)：调用await方法后，使当前线程在锁存器(内部计数器)倒计数至零之前一直等待，进入休眠状态，除非线程被 中断或超出了指定的等待时间。如果当前计数为零，则此方法立刻返回true值。
- acountDown()：acountDown方法递减锁存器的计数，如果计数到达零，则释放所有等待的线程。如果当前计数大于零，则将计数减少。如果新的计数为零，出于线程调度目的，将重新启用所有的等待线程。

```
    public void countDown() {
        sync.releaseShared(1);
    }
```
- getCount()：调用此方法后，返回当前计数，即还未完成的操作数，此方法通常用于调试和测试。


下边是使用的例子：
```
public class TestCountDownLatch1 {
     public static void main(String[] args) throws InterruptedException {
          int count = 3;
          CountDownLatch countDownLatch = new CountDownLatch(count);
          for (int i = 0; i < count; i++) {
               final int index = i;
               new Thread(() -> {
                    try {
                         Thread.sleep(1000 + ThreadLocalRandom.current().nextInt(1000));
                         System.out.println("finish" + index + Thread.currentThread().getName());
                    } catch (InterruptedException e) {
                         e.printStackTrace();
                    }finally{
                        countDownLatch.countDown();
                    }
               }).start();
          }
          countDownLatch.await();// 主线程在阻塞，当计数器==0，就唤醒主线程往下执行。
          System.out.println("主线程:在所有任务运行完成后，进行结果汇总");
     }
}
```

CountDownLatch是通过AQS的state字段来实现的一个计数器，计数器的初始值（state的值）为new CountDownLatch设置的数量，每次调用countDown的时候，state的值会进行减1，最后某个线程将state值减为0时，会把调用了await()进行阻塞等待的线程进行唤醒。CountDownLatch重写了tryReleaseShared这个方法，只有当state这个字段被设置为0时，也就是tryReleaseShared返回true的情况就会执行doReleaseShared方法，把调用了await的线程进行唤醒。

- CountDownLatch不能重新初始化或者修改CountDownLatch内部计数器的值。
- CountDownLatch和Semaphore在使用AQS的方式上很相似，在同步状态中都是保存的是当前的计数值。
- CountDownLatch的作用就是允许一个或多个线程等待其他线程完成操作，看起来有点类似join() 方法，但其提供了比 join() 更加灵活的API。
- CountDownLatch可以手动控制在n个线程里调用n次countDown()方法使计数器进行减一操作，也可以在一个线程里调用n次执行减一操作。
- join() 的实现原理是不停检查join线程是否存活，如果 join 线程存活则让当前线程永远等待。所以两者之间相对来说还是CountDownLatch使用起来较为灵活。


> 引用自：https://zhuanlan.zhihu.com/p/365320915

#### 8. Semaphore

Semaphore 是并发包中的一个工具类，可理解为信号量。通常可以作为限流器使用，即限制访问某个资源的线程个数，比如用于限制连接池的连接数。打个通俗的比方，可以把 Semaphore 理解为一辆公交车：车上的座位数（初始的“许可”permits数量）是固定的，行驶期间如果有人上车（获取许可），座位数（许可数量）就会减少，当人满的时候不能再继续上车了（获取许可失败）；而有人下车（释放许可）后就空出了一些座位，其他人就可以继续上车了。

```
public class SemaphoreTest {
  public static void main(String[] args) {
    // 初始化 Semaphore
    // 这里的许可数为 2，即同时最多有 2 个线程可以获取到
    Semaphore semaphore = new Semaphore(2);
    for (int i = 0; i < 50; i++) {
      new Thread(() -> {
        try {
          // 获取许可
          semaphore.acquire();
          System.out.println(Thread.currentThread().getName() + " 正在执行..");
          // 模拟操作
          TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
          e.printStackTrace();
        } finally {
          // 释放许可
          semaphore.release();
        }
      }).start();
    }
  }
}
```

![图片](images/WX20210822-151155@2x-8.png)


#### 9. 各种锁对比

##### 9.1 synchronized关键字与ReentrantLock区别

	- 可重入性：从名字上理解，ReenTrantLock的字面意思就是再进入的锁，其实synchronized关键字所使用的锁也是可重入的，两者关于这个的区别不大。两者都是同一个线程没进入一次，锁的计数器都自增1，所以要等到锁的计数器下降为0时才能释放锁。
	- 公平性：ReentrantLock提供了公平锁和非公平锁两种API，开发人员完全可以根据应用场景选择锁的公平性；synchronized是作为Java关键字是依赖于JVM实现，Java团队应该是优先考虑性能问题，因此synchronized是非公平锁。
	- 可中断的，Synchronized是不可中断的。ReentrantLock提供可中断和不可中断两种方式。其中lockInterruptibly方法表示可中断，lock方法表示不可中断。
	- 锁的实现：Synchronized是依赖于JVM实现的，而ReenTrantLock是JDK实现的，有什么区别，说白了就类似于操作系统来控制实现和用户自己敲代码实现的区别。前者的实现是比较难见到的，后者有直接的源码可供阅读。
	- 性能的区别：在Synchronized优化以前，synchronized的性能是比ReenTrantLock差很多的，但是自从Synchronized引入了偏向锁，轻量级锁（自旋锁）后，两者的性能就差不多了。在两种方法都可用的情况下，官方甚至建议使用synchronized，其实synchronized的优化我感觉就借鉴了ReenTrantLock中的CAS技术。都是试图在用户态就把加锁问题解决，避免进入内核态的线程阻塞。
	- 用法比较：Lock使用起来比较灵活，但是必须有释放锁的配合动作Lock必须手动获取与释放锁，而 synchronized不需要手动释放和开启锁Lock只适用于代码块锁，而 synchronized可用于修饰方法、代码块等
	- 功能区别：便利性：很明显Synchronized的使用比较方便简洁，并且由编译器去保证锁的加锁和释放，而ReenTrantLock需要手工声明来加锁和释放锁，为了避免忘记手工释放锁造成死锁，所以最好在finally中声明释放锁。锁的细粒度和灵活度：很明显ReenTrantLock优于Synchronized。ReenTrantLock独有的能力：

		- ReenTrantLock可以指定是公平锁还是非公平锁。而synchronized只能是非公平锁。所谓的公平锁就是先等待的线程先获得锁。
		- ReenTrantLock提供了一个Condition（条件）类，用来实现分组唤醒需要唤醒的线程们，而不是像synchronized要么随机唤醒一个线程要么唤醒全部线程。
		- ReenTrantLock提供了一种能够中断等待锁的线程的机制，通过lock.lockInterruptibly()来实现这个机制。

	- Lock 是一个接口，而 synchronized 是 Java 中的关键字， synchronized 是内置的语言实现。
	- synchronized 在发生异常时，会自动释放线程占有的锁，因此不会导致死锁现象发生；而 Lock 在发生异常时，如果没有主动通过 unLock()去释放锁，则很可能造成死锁现象，因此使用 Lock 时需要在 finally 块中释放锁。

##### 9.2 volatile和synchronized的区别

	- volatile本质是在告诉jvm当前变量在寄存器（工作内存）中的值是不确定的，需要从主存中读取； synchronized则是锁定当前变量，只有当前线程可以访问该变量，其他线程被阻塞住。因为一个线程 A 修改了变量还没结束时，另外的线程 B 可以看到已修改的值，而且可以修改这个变量，而不用等待 A 释放锁，因为volatile变量没上锁。
	- volatile仅能使用在变量级别；synchronized则可以使用在变量、方法、和类级别的
	- volatile仅能实现变量的修改可见性，不能保证原子性；而synchronized则可以保证变量的修改可见性和原子性
	- volatile不会造成线程的阻塞；synchronized可能会造成线程的阻塞。
	- volatile标记的变量不会被编译器优化；synchronized标记的变量可以被编译器优化
	- volatile 表示变量在 CPU 的寄存器中是不确定的，必须从主存中读取。保证多线程环境下变量的可见性；禁止指令重排序。


##### 9.3 各种锁比对

	- synchronized关键字它的底层实现，是通过hotspot虚拟机内置实现的，在对某个共享资源进行加锁之后，只能允许一个线程进行访问，其他线程只能在对象锁上的等待池中进行等待，并且是不可中断，无休止等待下去，只有等持有锁的线程执行结束，会随机唤醒等待池中的某个线程去执行。所以synchronized所提供的是一个排它锁，可重入锁，非公平锁。synchronized在1.6之后就对锁的实现进行了优化，大部分情况下synchronized的性能还是可以的。

	- ReentrantLock 可重入锁，它的实现是AQS+CAS一段代码来实现的，CAS操作是通过unsafe提供的原子操作，来对状态进行更新，相较于synchronized提供的锁，ReentrantLock提供的锁，有了更细粒度的操作，比如可以知道当前线程是否获取到了锁，如果没有获取到锁，那么在多久之后，可以进行终止等待，避免了无休止的等到操作。ReentrantLock提供的锁是，排它锁，可重入的，可以是公平也可以使非公平 （公平锁相对于非公平锁会消耗一点性能，因为每次在尝试获取到锁的时候，都需要来计算是否要将线程放入等待队列中去）

	- ReentrantReadWriteLock 读写锁 ，实现方式也是AQS+CAS 代码实现，它的不同就是对于共享资源，如果我们只是读取的话，可以多个线程同时访问，如果对共享资源进行修改的话，同一时间只能有一个线程持有，当然如果有线程正在读取共享资源，写线程必须要进行等待，这一点也正是读写线程速度相对来说比较慢的一个原因，因为在实际场景当中，我们都是读多写少，但是在读的时候不能写，也就意味着写操作会一直阻塞直到所有读操作结束。

	- StampedLock 读写锁 由于我们大部分场景都是读多写少，JDK1.8提供了一个全新的读写锁，其实现方式是通过CAS+双向链表，他的特点就是提供了乐观读，乐观是相对于数据库中悲观锁和乐观锁而言的，在读取的时候，先不加锁，也不通过CAS去修改数据，当乐观锁失败后，转为悲观锁，进行加锁操作，而StampedLock最棒的地方就是乐观锁，即乐观读取，因为我们大部分时候是读多写少，就不需要通过CAS来修改状态，这样进一步提高了性能。StampedLock是不可重入的，但是其性能不会因为不可重入受影响。缺点是：使用时每个锁的获取和释放都基于票据，如果一不小心，代码逻辑或者票据错误很容易造成死锁

	以上介绍了几种锁各自的特点使用场景及缺点，以下进行总结：

		- ReentrantReadWriteLock 在任何场景下都不推荐使用，因为其相关的功能通能被StampedLock锁代替，并且速度更快
		- StampedLock 在线程竞争不激烈的情况下，他的读写锁是比自身的乐观锁要快的，当线程数量很大的时候，乐观锁的优势就体现出来了
		- synchronized锁整体来说，性能也不错，在对性能要求极其严格的情况下，需要写具体的代码进行压测对比。

	- StampedLock 并不能完全代替ReentrantReadWriteLock ，在读多写少的场景下因为乐观读的模式，允许一个写线程获取写锁，解决了写线程饥饿问题，大大提高吞吐量。在使用乐观读的时候需要注意按照编程模型模板方式去编写，否则很容易造成死锁或者意想不到的线程安全问题。


> 引用自： https://zhuanlan.zhihu.com/p/379827927

> 这个也不错：https://segmentfault.com/a/1190000024540229 或者这个 https://juejin.cn/post/6844903865154797581

#### 10. StampedLock锁

从ReentrantLock到ReentrantReadWriteLock，再到StampedLock，读操作并发度依次提高。ReentrantReadWriteLock采用“悲观读”策略，当第一个读线程抢到共享锁，第二个、第三个读线程还可以抢到共享锁，使得写线程一直无法获取互斥写锁，会导致写线程“饿死”。读写锁的公平/非公平实现中，尽量避免这种情形，但还有可能发生。StampedLock通过读写不互斥进一步提高读的并发量。读写不互斥的问题在于：会产生不可重复读，两次读取结果不一样。即读取的时候，可能另一个线程正在修改该值，还没有完成，读完之后，写线程也操作结束，此时读线程读到的数据和真实的数据不一致。

##### 10.1 StampedLock的解决方式

StampedLock引入了“乐观读”策略：读的时候不加读锁，读出来发现数据被修改了，再升级为“悲观读”；即读错了再严格读一次；相当于降低了“读”的地位，把抢锁的天平往“写”的一方倾斜了一下，避免写线程被饿死。StampedLock是一个读写锁，悲观读和悲观写的锁状态需要同步，互斥，锁状态操作需要是原子操作。首先需要在state中划分出读锁和写锁。

第1-7位记录共享锁读锁，每获取一个读锁，该7位+1，如果溢出，每溢出一次，readerOverflow+1；每释放一个读锁，该值-1，如果不够，借位readerOverflow的值。第8位记录互斥锁写锁状态，如果存在写锁，该位记1，不存在记0；第8-64位用于记录乐观锁版本号。每获取一次写锁，state+WBIT，即从第8位开始的值。释放写锁，并不让state-WBIT，保证乐观锁版本号的单调递增，防止乐观锁出现ABA问题，即在tryOptimisticRead和validate(stamp)之间获取写锁并释放写锁。如果从第8位到第64位都是1，则再加WBIT，将导致state是0，因为64位越界，此时将state复位ORIGIN：获取写锁的时候，state+WBIT，释放的时候state+WBIT，第一次让写锁位置位1，第二次让写锁位置位0，同时乐观锁位表示的值增大。当写锁位是1的时候，悲观读锁位都是0，readerOverflow也是0。当写锁位是0的时候，如果悲观锁抢锁，则写锁位的7位以及readerOverflow用于记录cowait链表获取共享读锁的状态。

![图片](images/WX20210822-151155@2x-9.png)


### 其他

> 引用自：https://blog.csdn.net/lkforce/article/details/81128115
1. Mark Word

    Mark Word记录了对象和锁有关的信息，当这个对象被synchronized关键字当成同步锁时，围绕这个锁的一系列操作都和Mark Word有关。Mark Word在32位JVM中的长度是32bit，在64位JVM中长度是64bit。Mark Word在不同的锁状态下存储的内容不同，在32位JVM中是这么存的：

    ![图片](images/WX20210716-113420@2-8x.png)
    
    其中无锁和偏向锁的锁标志位都是01，只是在前面的1bit区分了这是无锁状态还是偏向锁状态。JDK1.6以后的版本在处理同步锁时存在锁升级的概念，JVM对于同步锁的处理是从偏向锁开始的，随着竞争越来越激烈，处理方式从偏向锁升级到轻量级锁，最终升级到重量级锁。JVM一般是这样使用锁和Mark Word的：
        - 当没有被当成锁时，这就是一个普通的对象，Mark Word记录对象的HashCode，锁标志位是01，是否偏向锁那一位是0。
        - 当对象被当做同步锁并有一个线程A抢到了锁时，锁标志位还是01，但是否偏向锁那一位改成1，前23bit记录抢到锁的线程id，表示进入偏向锁状态。
        - 当线程A再次试图来获得锁时，JVM发现同步锁对象的标志位是01，是否偏向锁是1，也就是偏向状态，Mark Word中记录的线程id就是线程A自己的id，表示线程A已经获得了这个偏向锁，可以执行同步锁的代码。
        - 当线程B试图获得这个锁时，JVM发现同步锁处于偏向状态，但是Mark Word中的线程id记录的不是B，那么线程B会先用CAS操作试图获得锁，这里的获得锁操作是有可能成功的，因为线程A一般不会自动释放偏向锁。如果抢锁成功，就把Mark Word里的线程id改为线程B的id，代表线程B获得了这个偏向锁，可以执行同步锁代码。如果抢锁失败，则继续执行步骤5。
        - 偏向锁状态抢锁失败，代表当前锁有一定的竞争，偏向锁将升级为轻量级锁。JVM会在当前线程的线程栈中开辟一块单独的空间，里面保存指向对象锁Mark Word的指针，同时在对象锁Mark Word中保存指向这片空间的指针。上述两个保存操作都是CAS操作，如果保存成功，代表线程抢到了同步锁，就把Mark Word中的锁标志位改成00，可以执行同步锁代码。如果保存失败，表示抢锁失败，竞争太激烈，继续执行步骤6。
        - 轻量级锁抢锁失败，JVM会使用自旋锁，自旋锁不是一个锁状态，只是代表不断的重试，尝试抢锁。从JDK1.7开始，自旋锁默认启用，自旋次数由JVM决定。如果抢锁成功则执行同步锁代码，如果失败则继续执行步骤7。
        - 自旋锁重试之后如果抢锁依然失败，同步锁会升级至重量级锁，锁标志位改为10。在这个状态下，未抢到锁的线程都会被阻塞。

> 引用自：https://segmentfault.com/a/1190000021084737?hmsr=toutiao.io&utm_campaign=toutiao.io&utm_medium=toutiao.io&utm_source=toutiao.io        
2. 可见性实现的原理
   一个线程对共享变量值的修改，能够及时地被其他线程看到。线程1对共享变量的修改要想被线程2及时看到，必须要经过如下的两个步骤：
  
   - 把工作内存1中更新过的共享变量刷新到主内存中
   - 把内存中最新的共享变量的值更新到工作内存2中
  
   导致共享变量在线程间不可见的原因：
   
   - 线程的交叉执行
   - 重排序结合线程交叉执行
   - 共享变量更新后的值没有在工作内存与主内存间及时更新
   
3. synchronized实现可见性
   - 线程解锁前，必须把共享变量的最新值刷新到主内存中。
   - 线程加锁时，将清空工作内存中共享变量的值,从而使用共享变量时需要从主内存中重新读取最新的值（注意：加锁与解锁需要的是同一把锁）
   - 这两点结合起来，就可以保证线程解锁前对共享变量的修改在下次加锁时对其他的线程可见，也就保证了线程之间共享变量的可见性。
   
4. 重排序
	重排序：代码书写的顺序与实际执行的顺序不同，指令重排序是编译器或处理器为了提供程序的性能而做的优化。指令重排能保证串行语义一致，但没有义务保证多线程间的语义也一致。之所以存在指令重排完全是为了提高性能。问题：为什么指令重排可以提高性能呢？减少执行流水线中断，从而提高了 CPU 处理性能。分类：

		- 编译器优化的重排序（编译器优化）
		- 指令级并行重排序（处理器优化）
		- 内存系统的重排序（处理器优化）

	as-if-serial:无论如何重排序，程序执行的结果应该和代码顺寻执行的结果一致（Java编译器、运行时和处理器都会保证Java在单线程下遵循as-if-serial语义），重排序不会给单线程带来内存可见性问题。重排序不会给单线程带来内存可见性问题。多线程中程序交错执行时，重排序可能会照成内存可见性问题。指令重排是基于以下原则之上：

		- 一个线程内保证语义的串行性
		- volatile 规则：volatile 变量的写，先发生于读，保证了 volatile 变量的可见性
		- 锁规则：解锁必然发生在随后的加锁之前
		- 传递性：A 先于 B，B 先于 C，那么 A 必然先于 C
		- 线程的 start() 方法先于他的每一个动作
		- 线程的所有操作先于线程的终结
		- 线程的中断先于被中断线程的代码
		- 对象的构造函数执行、结束先于 finalize() 方法

6. volatile如何实现内存可见性：

    volatile 关键字，能够保证volatile变量的可见性，不能保证volatile变量的原子性。深入来说：通过加入内存屏障和禁止重排序优化来实现的。通俗的讲：volatile 变量在每次被线程访问时，都强迫从主内存中重读该变量的值，而当变量发生变化时，又强迫线程将最新的值刷新到主内存。这样任何时刻，不同的线程总能看到该变量的最新的值。
    
    - 对 volatile 变量执行写操作时，会在写操作后加入一条 store 屏障指令。store 指令会在写操作后把最新的值强制刷新到主内存中。同时还会禁止 cpu 对代码进行重排序优化。这样就保证了值在主内存中是最新的。
    - 对 volatile 变量执行读操作时，会在读操作前加入一条 load 屏障指令。load 指令会在读操作前把工作内存缓存中的值清空后，再从主内存中读取最新的值。
    
    从 Load 到store 到内存屏障，一共4步，其中最后一步jvm让这个最新的变量的值在所有线程可见，也就是最后一步让所有的CPU内核都获得了最新的值，但中间的几步（从Load到Store）是不安全的，中间如果其他的 CPU 修改了值将会丢失。为 volatile 变量赋值的场景，不要存在依赖于 volatile 变量情况。


7. 保证方法操作的原子性

    - 使用synchronized关键字
    - 使用ReentrantLock(java.until.concurrent.locks包下)
    - 使用AtomicInterger(vava,util.concurrent.atomic包下)

8. volatile 适用场景
    要在多线程总安全的使用volatile变量，必须同时满足：对变量的写入操作不依赖其当前值，boolean变量、记录温度变化的变量等，该变量没有包含在具有其他变量的不变式中
    不满足：number++、count=count*5，不满足：不变式 low < up

9. 内存屏障

   内存屏障（memory barrier）是一个 CPU 指令。基本上，它是这样一条指令： a) 确保一些特定操作执行的顺序； b) 影响一些数据的可见性(可能是某些指令执行后的结果)。编译器和 CPU 可以在保证输出结果一样的情况下对指令重排序，使性能得到优化。插入一个内存屏障，相当于告诉 CPU 和编译器先于这个命令的必须先执行，后于这个命令的必须后执行。内存屏障另一个作用是强制更新一次不同 CPU 之间的缓存。例如，一个写屏障会把这个屏障前写入的数据刷新到缓存，这样任何试图读取该数据的线程将得到最新值，而不用考虑到底是被哪个 CPU 核心或者哪颗 CPU 执行的。
   
   - Store Barrier：Store屏障，是x86的”sfence“指令，强制所有在store屏障指令之前的store指令，都在该store屏障指令执行之前被执行，并把store缓冲区的数据都刷到CPU缓存。这会使得程序状态对其它CPU可见，这样其它CPU可以根据需要介入。一个实际的好例子是Disruptor中的BatchEventProcessor。当序列Sequence被一个消费者更新时，其它消费者(Consumers)和生产者（Producers）知道该消费者的进度，因此可以采取合适的动作。所以屏障之前发生的内存更新都可见了。
   - Load Barrier：Load屏障，是x86上的”ifence“指令，强制所有在load屏障指令之后的load指令，都在该load屏障指令执行之后被执行，并且一直等到load缓冲区被该CPU读完才能执行之后的load指令。这使得从其它CPU暴露出来的程序状态对该CPU可见，这之后CPU可以进行后续处理。一个好例子是上面的BatchEventProcessor的sequence对象是放在屏障后被生产者或消费者使用。
   - Full Barrier：Full屏障，是x86上的”mfence“指令，复合了load和save屏障的功能。
   
10. JVM之Java线程启动流程
    了解到Java线程其实是映射到操作系统的内核线程上的，所以Java线程基本上也就是操作系统在进行管理。首先，调用Java线程start（）方法，通过jni方式，调用到JVM层。其次，JVM通过pthread_create（）创建一个系统内核线程，并指定内核线程的初始运行地址，即一个方法指针。最后，在内核线程的初始运行方法中，利用JavaCalls模块，调用java线程的run（）方法，开始java级别的线程执行。
    
    
11. 引用分级别

    https://mp.weixin.qq.com/s/gA7nZtmvgbNgdP5QipcYJQ
    
    https://zhuanlan.zhihu.com/p/28258571?hmsr=toutiao.io&utm_campaign=toutiao.io&utm_medium=toutiao.io&utm_source=toutiao.io

> 引用自：https://mp.weixin.qq.com/s/q3XhFFLDWhcAg08pGK4smg
12. JVM对锁进行了优化，都优化了啥？

    从JDK1.6开始，JVM对锁进行了各种优化，目的就是为了在线程间更高效的共享数据和解决互斥同步的问题。从锁优化的话题开始，可以引申出很多考点面试题，比如锁优化的技术、各优化技术的细节、CAS实现原理、CAS的ABA问题及如何解决等，持续发散还会引发更多问题，例如逃逸分析等，可以看出技术点都是相关联的，需要不断积累和梳理。
    
    面试官：JVM实现了哪些锁优化技术？小白：自旋锁、自适应自旋锁、锁粗化、锁消除、偏向锁、轻量级锁。
    
    面试官：介绍一下自旋锁？为什么引入自旋锁？小白：自旋锁就是在请求获取锁，又不能马上获取到时，让当前线程在不放弃处理器执行时间的情况下执行忙循环，尝试等待锁被释放，再获取锁。引入自旋锁是为了节省线程挂起和恢复的开销。
    
    面试官：你刚刚说引入自旋锁节省了线程挂起和恢复的开销，但循环也是需要占用处理器时间的，那这个自旋的次数如何控制？小白：默认是10次，也可以通过JVM参数-XX:PreBlockSpin配置，当然这些自旋都是固定的，所以引入了自适应自旋锁，自旋的次数由前一次在同一个锁上的自旋次数和锁的拥有者的状态来决定。如果前面线程成功获取锁并且正常运行，那么本次获取锁的可能性很大，所以自旋的次数相对多一些；如果前面线程很少成功获取锁，那么本次获取锁的概率也很小，就可能不执行自旋了。
    
    面试官：锁粗化优化了什么？小白：如果在一段代码中同一线程反复获取、释放同一个对象的锁，将会生产不必要的性能开销，所以需要把获锁的范围扩大，对同一个对象的锁操作只进行一次，在头部获取锁，在尾部释放锁。
    
    面试官：锁消除是什么？小白：锁消除是指JIT在运行时分析到使用了锁的同步代码在实际运行时不可能存在共享数据被竞争的情况，对锁进行去除。例如如果一个局部变量在方法内部不可能被外部引用，那么它就不需要加锁控制，可以去掉锁。（注意：如果你的回答中提到了逃逸分析，面试官很有可能会问你什么是逃逸分析，提前做好准备）
    
    面试官：详细说一下偏向锁？小白：偏向锁就是如果线程持有了锁，在后续的过程中，只要该锁没有被其它线程持有，那么持有偏向锁的线程将不再需要进行同步操作。这个偏向锁的相关信息是保存在Java对象的对象头中的。在HotSpot虚拟机中，Java对象在内存中存储的布局分为3块区域：对象头、实例数据和对齐填充。对象头包含两部分，第一部分包含对象的HashCode、分代年龄、锁标志位、线程持有的锁、偏向线程ID等数据，这部分数据的长度在32位和64位虚拟机中分别为32bit和64bit，官方称为Mark World，用一张图展示不同状态下，对象头中存储的内容。
    
      ![图片](images/WX20210725-165415@2-6x.png)
    
    一个普通Java对象刚开始是处于无锁状态的，Mark World中存储的数据如上图中的第一行所示。当虚拟机启动了偏向锁，锁对象第一次被线程获取的时候，锁标识位置为01，同时使用CAS将获取到这个锁的线程ID设置到Mark World中，如果CAS操作成功，那么这个线程将可以继续执行相关的同步代码。如果此时有其它线程尝试获取锁，有两种情况，一种是锁对象未被锁定，则偏向锁被撤销，恢复到无锁状态；另一种是对象被锁定，那么偏向锁失效，同时升级为轻量级锁，会在当前线程的栈帧中创建一个锁记录的空间，这个空间存储对象头中Mark World的拷贝，就是复制一份到这个锁记录空间，同时虚拟机使用CAS尝试将这个锁记录空间的指针更新到Mark World，如果CAS操作成功，那么当前线程获取到锁，此时锁状态处于轻量级锁，锁标志位置为00。
    
    面试官：你刚刚说到虚拟机使用CAS进行更新操作，Java中的CAS是什么及如何实现的？小白：CAS（Compare and swap）是比较和替换，是一种通过硬件实现并发安全的常用技术，底层通过利用CPU的CAS指令对缓存加锁或总线加锁的方式来实现多处理器之间的原子操作。它的实现过程是，有3个操作数，内存值V，旧的预期值E，要修改的新值U，当且仅当预期值E和内存值V相同时，才将内存值V修改为U，否则什么都不做。CAS底层实现使用了C++，在其代码中会根据操作系统和处理器的不同来选择对应的调用代码，以Windows和x86处理器为例，如果是多处理器，通过带lock前缀的cmpxchg指令对缓存加锁或总线加锁的方式来实现多处理器之间的原子操作；如果是单处理器，通过cmpxchg指令完成原子操作。
    
    面试官：那你知道CAS中的ABA问题吗？小白：知道，CAS是当且仅当旧的预期值E和内存值V相同时，才将内存值V修改为U，也就是如果内存值V没有发生变化则更新，但是有可能发生内存值原来是A，中间被改成B，后来又被改成A，此时再使用CAS进行检查时发现没有变化，但是实际上发生了变化，这就是ABA问题。
    
    面试官：这个问题如何解决？小白：Java并发包下的AtomicStampedReference可以解决ABA问题，内部实现上添加了一个类似于版本号作用的stamp属性，它是被自动更新的。实现上首先检查当前引用是否等于预期引用、当前stamp是否等于预期stamp，如果全部相等，则以原子方式将该引用和该stamp的值设置为给定的更新值。
    
 
 > 引用自：https://www.heapdump.cn/article/340337
13. notify执行之后立马唤醒线程吗
 	其实hotspot里真正的实现是退出同步块的时候才会去真正唤醒对应的线程，不过这个也是个默认策略，也可以改的，在notify之后立马唤醒相关线程。
 
14. 被notify(All)的线程有规律吗
 	这里要分情况： * 如果是通过notify来唤起的线程，那先进入wait的线程会先被唤起来 * 如果是通过nootifyAll唤起的线程，默认情况是最后进入的会先被唤起来，即LIFO的策略
 
15. notifyAll是怎么实现全唤起的
 	或许大家立马想到这个简单，一个for循环就搞定了，不过在jvm里没实现这么简单，而是借助了monitorexit，上面我提到了当某个线程从wait状态恢复出来的时候，要先获取锁，然后再退出同步块，所以notifyAll的实现是调用notify的线程在退出其同步块的时候唤醒起最后一个进入wait状态的线程，然后这个线程退出同步块的时候继续唤醒其倒数第二个进入wait状态的线程，依次类推，同样这这是一个策略的问题，jvm里提供了挨个直接唤醒线程的参数，不过都很罕见就不提了。
 
16. wait的线程是否会影响load
 	这个或许是大家比较关心的话题，因为关乎系统性能问题，wait/nofity是通过jvm里的park/unpark机制来实现的，在linux下这种机制又是通过pthread_cond_wait/pthread_cond_signal来玩的，因此当线程进入到wait状态的时候其实是会放弃cpu的，也就是说这类线程是不会占用cpu资源。
    