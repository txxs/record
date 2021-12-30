[TOC]

---
### 一、整体知识

Java集合主要可以划分为4个部分：List列表、Set集合、Map映射、工具类(Iterator迭代器、Enumeration枚举类、Arrays和Collections)

![图片](images/WX20211005-173843@2-1x.png)

迭代器接口，这是Collection类的父接口。实现这个Iterable接口的对象允许使用foreach进行遍历，也就是说，所有的Collection集合对象都具有"foreach可遍历性"。这个Iterable接口只有一个方法: iterator()。它返回一个代表当前集合对象的泛型<T>迭代器，用于之后的遍历操作。

- Collection是最基本的集合接口，一个Collection代表一组Object的集合，这些Object被称作Collection的元素。Collection是一个接口，用以提供规范定义，不能被实例化使用。
- Map用于保存具有"映射关系"的数据，因此Map集合里保存着两组值，一组值用于保存Map里的key，另外一组值用于保存Map里的value。key和value都可以是任何引用类型的数据。Map的key不允许重复，即同一个Map对象的任何两个key通过equals方法比较结果总是返回false。关于Map，我们要从代码复用的角度去理解，java是先实现了Map，然后通过包装了一个所有value都为null的Map就实现了Set集合。Map的这些实现类和子接口中key集的存储形式和Set集合完全相同(即key不能重复)。Map的这些实现类和子接口中value集的存储形式和List非常类似(即value可以重复、根据索引来查找)
- Set集合类似于一个罐子，"丢进"Set集合里的多个对象之间没有明显的顺序。Set继承自Collection接口，不能包含有重复元素(记住，这是整个Set类层次的共有属性)。
  Set判断两个对象相同不是使用"=="运算符，而是根据equals方法。也就是说，我们在加入一个新元素的时候，如果这个新元素对象和Set中已有对象进行注意equals比较都返回false，则Set就会接受这个新元素对象，否则拒绝。因为Set的这个制约，在使用Set集合的时候，应该注意两点：1) 为Set集合里的元素的实现类实现一个有效的equals(Object)方法、2) 对Set的构造函数，传入的Collection参数不能包含重复的元素。
- List集合代表一个元素有序、可重复的集合，集合中每个元素都有其对应的顺序索引。List集合允许加入重复元素，因为它可以通过索引来访问指定位置的集合元素。List集合默认按元素的添加顺序设置元素的索引。
- Queue用于模拟"队列"这种数据结构(先进先出 FIFO)。队列的头部保存着队列中存放时间最长的元素，队列的尾部保存着队列中存放时间最短的元素。新元素插入(offer)到队列的尾部，访问元素(poll)操作会返回队列头部的元素，队列不允许随机访问队列中的元素。结合生活中常见的排队就会很好理解这个概念。

从另一个角度看集合：

- Array--:底层数据结构是数组，查询快，增删慢
- Linked--:底层数据结构是链表，查询慢，增删快
- Hash--:底层数据结构是哈希表。依赖两个方法：hashCode()和equals()
- Tree--:底层数据结构是二叉树。两种方式排序：自然排序和比较器排序

> 引用自：https://www.cnblogs.com/LittleHann/p/3690187.html

### 二、Set

- 1) HashSet的性能总是比TreeSet好(特别是最常用的添加、查询元素等操作)，因为TreeSet需要额外的红黑树算法来维护集合元素的次序。只有当需要一个保持排序的Set时，才应该使用TreeSet，否则都应该使用HashSet
- 2) 对于普通的插入、删除操作，LinkedHashSet比HashSet要略慢一点，这是由维护链表所带来的开销造成的。不过，因为有了链表的存在，遍历LinkedHashSet会更快
- 3) EnumSet是所有Set实现类中性能最好的，但它只能保存同一个枚举类的枚举值作为集合元素
- 4) HashSet、TreeSet、EnumSet都是"线程不安全"的，通常可以通过Collections工具类的synchronizedSortedSet方法来"包装"该Set集合。
- SortedSet s = Collections.synchronizedSortedSet(new TreeSet(...));

#### 2.1 HashSet

HashSet是Set接口的典型实现，HashSet使用HASH算法来存储集合中的元素，因此具有良好的存取和查找性能。当向HashSet集合中存入一个元素时，HashSet会调用该对象的hashCode()方法来得到该对象的hashCode值，然后根据该HashCode值决定该对象在HashSet中的存储位置。值得主要的是，HashSet集合判断两个元素相等的标准是两个对象通过equals()方法比较相等，并且两个对象的hashCode()方法的返回值相等。

如果两个对象通过equals()方法比较返回true，但这两个对象的hashCode()方法返回不同的hashCode值时，这将导致HashSet会把这两个对象保存在Hash表的不同位置，从而使对象可以添加成功，这就与Set集合的规则有些出入了。所以，我们要明确的是:equals()决定是否可以加入HashSet、而hashCode()决定存放的位置，它们两者必须同时满足才能允许一个新元素加入HashSet但是要注意的是:如果两个对象的hashCode相同，但是它们的equlas返回值不同，HashSet会在这个位置用链式结构来保存多个对象。而HashSet访问集合元素时也是根据元素的HashCode值来快速定位的，这种链式结构会导致性能下降。

HashSet是基于HashMap实现的，HashSet底层采用HashMap来保存所有元素。为快速查找设计的Set。存入HashSet的对象必须定义hashCode()。hashCode和equal()是HashMap用的，因为无需排序所以只需要关注定位和唯一性即可。hashCode用来计算hash值，hash值是用来确定hash表索引，hash表中的一个索引存放的是一张链表，所以还要通过equal方法循环比较链上的每一个对象才可以真正定位到键值对应的Entry。put时，如果hash表中没定定位到，就在链表前加一个Entry，如果定位到了，则更换Entry中的value(值)并返回旧value(值)。覆写key的hashCode()和equal()时一定要注意，不要把它们和可变属性关联上，否则属性变了之后hashCode会变，equal也会为false，这样在Map中就找不到它了而且这样的对象因为找不到它所以得不到释放，这样就变成了一个无效引用(相当于内存泄漏)。

如果考虑线程安全的问题，可以考虑CopyOnWriteArraySet，用得就更少了（这是一个线程安全的Set，底层实际上就是CopyWriteOnArrayList)

#### 2.2 LinkedHashSet

LinkedHashSet集合也是根据元素的hashCode值来决定元素的存储位置，但和HashSet不同的是，它同时使用链表维护元素的次序，这样使得元素看起来是以插入的顺序保存的。当遍历LinkedHashSet集合里的元素时，LinkedHashSet将会按元素的添加顺序来访问集合里的元素。LinkedHashSet需要维护元素的插入顺序，因此性能略低于HashSet的性能，但在迭代访问Set里的全部元素时(遍历)将有很好的性能(链表很适合进行遍历)。

#### 2.3 SortedSet

此接口主要用于排序操作，即实现此接口的子类都属于排序的子类

#### 2.4 TreeSet

TreeSet是SortedSet接口的实现类，TreeSet可以确保集合元素处于排序状态。

与HashSet集合采用hash算法来决定元素的存储位置不同，TreeSet采用红黑树的数据结构来存储集合元素。TreeSet支持两种排序方式: 自然排序、定制排序。

- 自然排序：TreeSet会调用集合元素的compareTo(Object obj)方法来比较元素之间的大小关系，然后将集合元素按升序排序，即自然排序。如果试图把一个对象添加到TreeSet时，则该对象的类必须实现Comparable接口，否则程序会抛出异常。当把一个对象加入TreeSet集合中时，TreeSet会调用该对象的compareTo(Object obj)方法与容器中的其他对象比较大小，然后根据红黑树结构找到它的存储位置。如果两个对象通过compareTo(Object obj)方法比较相等，新对象将无法添加到TreeSet集合中(牢记Set是不允许重复的概念)。注意: 当需要把一个对象放入TreeSet中，重写该对象对应类的equals()方法时，应该保证该方法与compareTo(Object obj)方法有一致的结果，即如果两个对象通过equals()方法比较返回true时，这两个对象通过compareTo(Object obj)方法比较结果应该也为0(即相等)
- 定制排序：TreeSet的自然排序是根据集合元素的大小，TreeSet将它们以升序排序。如果我们需要实现定制排序，则可以通过Comparator接口的帮助(类似PHP中的array_map回调处理函数的思想)。该接口里包含一个int compare(T o1， T o2)方法，该方法用于比较大小。
```
    //根据M对象的age属性来决定大小
    public int compare(Object o1, Object o2)
    {
        M m1 = (M)o1;
        M m2 = (M)o2;
       return m1.age > m2.age ? -1: m1.age < m2.age ? 1 : 0;
    }
```
#### 2.5 EnumSet

EnumSet是一个专门为枚举类设计的集合类，EnumSet中所有元素都必须是指定枚举类型的枚举值，该枚举类型在创建EnumSet时显式、或隐式地指定。EnumSet的集合元素也是有序的，它们以枚举值在Enum类内的定义顺序来决定集合元素的顺序。

### 三、List

以上就是List集合类的编程应用场景。我们来梳理一下思路

- 1. java提供的List就是一个"线性表接口"，ArrayList(基于数组的线性表)、LinkedList(基于链的线性表)是线性表的两种典型实现
- 2. Queue代表了队列，Deque代表了双端队列(既可以作为队列使用、也可以作为栈使用)
- 3. 因为数组以一块连续内存来保存所有的数组元素，所以数组在随机访问时性能最好。所以的内部以数组作为底层实现的集合在随机访问时性能最好。
- 4. 内部以链表作为底层实现的集合在执行插入、删除操作时有很好的性能

- 5. 进行迭代操作时，以链表作为底层实现的集合比以数组作为底层实现的集合性能好
     我们之前说过，Collection接口继承了Iterable接口，也就是说，我们以上学习到的所有的Collection集合类都具有"可遍历性"Iterable接口也是java集合框架的成员，它隐藏了各种Collection实现类的底层细节，向应用程序提供了遍历Collection集合元素的统一编程接口:

- 1) boolean hasNext(): 是否还有下一个未遍历过的元素
- 2) Object next(): 返回集合里的下一个元素
- 3) void remove(): 删除集合里上一次next方法返回的元素

> 引用自：https://blog.csdn.net/zengxiantao1994/article/details/77018356

#### 3.1 ArrayList

ArrayList是基于数组实现的List类，它封装了一个动态的增长的、允许再分配的Object[]数组。如果一开始就知道ArrayList集合需要保存多少元素，则可以在创建它们时就指定initialCapacity大小，这样可以减少重新分配的次数，提供性能，ArrayList还提供了如下方法来重新分配Object[]数组

- 1) ensureCapacity(int minCapacity): 将ArrayList集合的Object[]数组长度增加minCapacity。
- 2) trimToSize(): 调整ArrayList集合的Object[]数组长度为当前元素的个数。程序可以通过此方法来减少ArrayList集合对象占用的内存空间。

如果考虑线程安全的问题，可以看看CopyWriteOnArrayList，实际开发用得不多，但我觉得可以了解一下它的思想（CopyWriteOn），这个思想在Linux/文件系统都有用到。

重要特性：ArrayList是基于数组实现的，是一个动态数组，其容量能自动增长；ArrayList不是线程安全的，只能用在单线程环境下；实现了Serializable接口，因此它支持序列化，能够通过序列化传输；实现了RandomAccess接口，支持快速随机访问，实际上就是通过下标序号进行快速访问；实现了Cloneable接口，能被克隆。

扩容过程：ArrayList相当于在没指定initialCapacity时就是会使用延迟分配对象数组空间，当第一次插入元素时才分配10（默认）个对象空间。假如有20个数据需要添加，那么会分别在第一次的时候，将ArrayList的容量变为10；之后扩容会按照1.5倍增长。也就是当添加第11个数据的时候，Arraylist继续扩容变为10*1.5=15；当添加第16个数据时，继续扩容变为15 * 1.5 =22个。每次扩容都是通过Arrays.copyOf(elementData, newCapacity) 这样的方式实现的。



#### 3.2 Vector

Vector和ArrayList在用法上几乎完全相同，但由于Vector是一个古老的集合，所以Vector提供了一些方法名很长的方法，但随着JDK1.2以后，java提供了系统的集合框架，就将Vector改为实现List接口，统一归入集合框架体系中。Stack继承自Vector，实现一个后进先出的堆栈。Stack提供5个额外的方法使得Vector得以被当作堆栈使用。基本的push和pop方法，还有peek方法得到栈顶的元素，empty方法测试堆栈是否为空，search方法检测一个元素在堆栈中的位置。Stack刚创建后是空栈。

#### 3.3 Stack

Stack是Vector提供的一个子类，用于模拟"栈"这种数据结构(LIFO后进先出)

#### 3.4 LinkedList

implements List<E>, Deque<E>。实现List接口，能对它进行队列操作，即可以根据索引来随机访问集合中的元素。同时它还实现Deque接口，即能将LinkedList当作双端队列使用。自然也可以被当作"栈来使用"。 **LinkedList实现了List接口，允许null元素**。对顺序访问进行了优化，向List中间插入与删除的开销并不大。随机访问则相对较慢。还具有下列方法：addFirst()，addLast()，getFirst()，getLast()，removeFirst()和removeLast()这些方法(没有在任何接口或基类中定义过)，这些操作使LinkedList可被用作堆栈（stack），队列（queue）或双向队列（deque）。注意LinkedList没有同步方法。如果多个线程同时访问一个List，则必须自己实现访问同步。一种解决方法是在创建List时构造一个同步的List：
```
List list = Collections.synchronizedList(newLinkedList(...));
```


### 四、Queue

#### 4.1 PriorityQueue

PriorityQueue并不是一个比较标准的队列实现，PriorityQueue保存队列元素的顺序并不是按照加入队列的顺序，而是按照队列元素的大小进行重新排序，这点从它的类名也可以看出来。PriorityQueue不允许插入null元素，它还需要对队列元素进行排序，PriorityQueue的元素有两种排序方式

- 1) 自然排序：采用自然顺序的PriorityQueue集合中的元素对象都必须实现了Comparable接口，而且应该是同一个类的多个实例，否则可能导致ClassCastException异常
- 2) 定制排序：创建PriorityQueue队列时，传入一个Comparator对象，该对象负责对队列中的所有元素进行排序。关于自然排序、定制排序的原理和之前说的TreeSet类似

#### 4.2 Deque

Deque接口代表一个"双端队列"，双端队列可以同时从两端来添加、删除元素，因此Deque的实现类既可以当成队列使用、也可以当成栈使用

#### 4.3 ArrayDeque

是一个基于数组的双端队列，和ArrayList类似，它们的底层都采用一个动态的、可重分配的Object[]数组来存储集合元素，当集合元素超出该数组的容量时，系统会在底层重新分配一个Object[]数组来存储集合元素。

#### 4.4 LinkedList

LinkedList 也是一个队列

### 五、Map

- 1) HashMap和Hashtable的效率大致相同，因为它们的实现机制几乎完全一样。但HashMap通常比Hashtable要快一点，因为Hashtable需要额外的线程同步控制
- 2) TreeMap通常比HashMap、Hashtable要慢(尤其是在插入、删除key-value对时更慢)，因为TreeMap底层采用红黑树来管理key-value对
- 3) 使用TreeMap的一个好处就是： TreeMap中的key-value对总是处于有序状态，无须专门进行排序操作

- HashMap：JDK1.8之前HashMap由数组+链表组成的，数组是HashMap的主体，链表则是主要为了解决哈希冲突而存在的（“拉链法”解决冲突）.JDK1.8以后在解决哈希冲突时有了较大的变化，当链表长度大于阈值（默认为8）时，将链表转化为红黑树，以减少搜索时间
- LinkedHashMap：LinkedHashMap继承自HashMap，所以它的底层仍然是基于拉链式散列结构即由数组和链表或红黑树组成。另外，LinkedHashMap在上面结构的基础上，增加了一条双向链表，使得上面的结构可以保持键值对的插入顺序。同时通过对链表进行相应的操作，实现了访问顺序相关逻辑。
- HashTable：数组+链表组成的，数组是 HashMap 的主体，链表则是主要为了解决哈希冲突而存在的
- TreeMap：红黑树（自平衡的排序二叉树）


#### 5.1 HashMap

和HashSet集合不能保证元素的顺序一样，HashMap也不能保证key-value对的顺序。并且类似于HashSet判断两个key是否相等的标准也是:两个key通过equals()方法比较返回true、同时两个key的hashCode值也必须相等。当使用自定义类作为HashMap、Hashtable的key时，如果重写该类的equals(Object obj)和hashCode()方法，则应该保证两个方法的判断标准一致--当两个key通过equals()方法比较返回true时，两个key的hashCode()的返回值也应该相同。

HashMap和Hashtable类似，不同之处在于HashMap是非同步的，并且允许null，即null value和null key。但是将HashMap视为Collection时（values()方法可返回Collection），其迭代子操作时间开销和HashMap的容量成比例。因此，如果迭代操作的性能相当重要的话，不要将HashMap的初始化容量设得过高，或者load factor过低。

HashMap的底层实现：

- JDK1.8 之前 ：底层是 数组和链表 结合在一起使用也就是 链表散列。HashMap 通过 key 的 hashCode 经过扰动函数（hash（）方法）处理过后得到 hash 值，然后通过 (n - 1) & hash 判断当前元素存放的位置（这里的 n 指的是数组的长度），如果当前位置存在元素的话，就判断该元素与要存入的元素的 hash 值以及 key 是否相同，如果相同的话，直接覆盖，不相同就通过拉链法解决冲突。

- JDK1.8之后：JDK1.8之后在解决哈希冲突时有了较大的变化，当链表长度大于阈值（默认为8）时，将链表转化为红黑树，以减少搜索时间。（TreeMap、TreeSet以及JDK1.8之后的HashMap底层都用到了红黑树。红黑树就是为了解决二叉查找树的缺陷，因为二叉查找树在某些情况下会退化成一个线性结构。）

写入过程：当添加一个元素（key-value）时，首先计算key的hash值，以此确定插入数组中的位置，但是可能存在同一个hash值的元素已经放在同一位置了，这是就添加到同一hash值元素的后面，他们在数组同一个位置，就形成了链表，同一个链表上的hash值是相同的，所以说数组存放的是链表。

1.7插入具体的过程：

	- 1、获得key对象的hashcode：首先调用key对象的hashcode()方法，获得hashcode。
	- 2、根据hashcode计算出hash值（要求在[0,数组长度-1]区间）hashcode是一个整数，我们需要将它转化成[0,数组长度-1]区间）的范围。我们要求转化后的hash值尽量均匀地分布在[0,数组长度-1]区间）,减少“hash冲突”。
	- 3、生成Entry对象，如上所述，一个Entry对象包含4部分：key对象、value对象、hash值、指向下一个Entry对象的引用。我们现在算出了hash值。下一个Entry对象的引用为null。
	- 4、将Entry对象放到table数组中，如果本Entry对象对应的数组索引位置还没有放Entry对象，则直接将Entry对象存储进数组；如果对应索引位置已经有Entry对象，则将已有Entry对象的next指向本Entry对象，形成链表。

1.8插入的过程：

	- 判断数组是否为空，为空进行初始化;
	- 不为空，计算 k 的 hash 值，通过(n - 1) & hash计算应当存放在数组中的下标 index;
	- 查看 table[index] 是否存在数据，没有数据就构造一个 Node 节点存放在 table[index] 中；
	- 存在数据，说明发生了 hash 冲突(存在二个节点 key 的 hash 值一样), 继续判断 key 是否相等，相等，用新的 value 替换原数据(onlyIfAbsent 为 false)；
	- 如果不相等，判断当前节点类型是不是树型节点，如果是树型节点，创造树型节点插入红黑树中；
	- 如果不是树型节点，创建普通 Node 加入链表中；判断链表长度是否大于 8， 大于的话链表转换为红黑树；
	- 插入完成之后判断当前节点数是否大于阈值，如果大于开始扩容为原数组的二倍。


获取过程：获得key的hashcode，通过hash()散列算法得到hash值，进而定位到数组的位置；在链表上挨个比较key对象。调用equel（）方法，将key对象和链表上所有节点的key对象进行比较，直到碰到返回true的节点对象为止；返回equel()为true的节点对象的value对象。

扩容时机：当map中包含的Entry的数量大于等于threshold = loadFactor * capacity的时候，且新建的Entry刚好落在一个非空的桶上，此刻触发扩容机制，将其容量扩大为2倍。（为什么2倍，而不是1.5倍，3倍，10倍；解释见最后的补充）当size大于等于threshold的时候，并不一定会触发扩容机制，但是会很可能就触发扩容机制，只要有一个新建的Entry出现哈希冲突，则立刻resize。

扩容总体分为两步：

扩容：创建一个新的Entry空数组，长度是原数组的2倍。
ReHash：遍历原Entry数组，把所有的Entry重新Hash到新数组。

1.7扩容过程：1.7 中整个扩容过程就是一个取出数组元素（实际数组索引位置上的每个元素是每个独立单向链表的头部，也就是发生 Hash 冲突后最后放入的冲突元素）然后遍历以该元素为头的单向链表元素，依据每个被遍历元素的 hash 值计算其在新数组中的下标然后进行交换（即原来 hash 冲突的单向链表尾部变成了扩容后单向链表的头部）。

1.8扩容过程：在 JDK 1.8 中 HashMap 的扩容操作就显得更加的骚气了，由于扩容数组的长度是 2 倍关系，所以对于假设初始 tableSize = 4 要扩容到 8 来说就是 0100 到 1000 的变化（左移一位就是 2 倍），在扩容中只用判断原来的 hash 值与左移动的一位（newtable 的值）按位与操作是 0 或 1 就行，0 的话索引就不变，1 的话索引变成原索引加上扩容前数组

头插法和尾插法的示意

![图片](images/WX20211005-173843@2-2x.png)

> 引用自：https://blog.csdn.net/qq_26222859/article/details/46124265

并发情况下存在的问题：

jdk1.7 HashMap的resize在多线程环境下，可能会产生条件竞争和死循环。如果两个线程都发现HashMap需要重新调整大小，那么它们会同时试着去调整大小。在调整大小时，存储在链表中的元素的次序会反过来，因为在放入新的位置时，HashMap会将Entry对象不断的插入链表的头部。插入头部也主要是为了防止尾部遍历，否则这对key的HashCode相同的Entry每次添加还要定位到尾节点。如果条件竞争发送了，可能会出现环形链表，之后当我们get(key)操作时，就有可能发生死循环。

这篇文章有非常好的解释（HashMap多线程并发问题分析）：https://www.cnblogs.com/andy-zhou/p/5402984.html


#### 5.2 LinkedHashMap

LinkedHashMap也使用双向链表来维护key-value对的次序，该链表负责维护Map的迭代顺序，与key-value对的插入顺序一致(注意和TreeMap对所有的key-value进行排序进行区分)

#### 5.3 Hashtable

是一个古老的Map实现类。Hashtable继承Map接口，实现一个key-value映射的哈希表。任何非空（non-null）的对象都可作为key或者value。由于作为key的对象将通过计算其散列函数来确定与之对应的value的位置，因此任何作为key的对象都必须实现hashCode和equals方法。hashCode和equals方法继承自根类Object，如果你用自定义的类当作key的话，要相当小心，按照散列函数的定义，如果两个对象相同，即obj1.equals(obj2)=true，则它们的hashCode必须相同，但如果两个对象不同，则它们的hashCode不一定不同，如果两个不同对象的hashCode相同，这种现象称为冲突，冲突会导致操作哈希表的时间开销增大，所以尽量定义好的hashCode()方法，能加快哈希表的操作。如果相同的对象有不同的hashCode，对哈希表的操作会出现意想不到的结果（期待的get方法返回null），要避免这种问题，只需要牢记一条：要同时复写equals方法和hashCode方法，而不要只写其中一个。


#### 5.4 SortedMap

正如Set接口派生出SortedSet子接口，SortedSet接口有一个TreeSet实现类一样，Map接口也派生出一个SortedMap子接口，SortedMap接口也有一个TreeMap实现类

#### 5.5 TreeMap

TreeMap就是一个红黑树数据结构，每个key-value对即作为红黑树的一个节点。TreeMap存储key-value对(节点)时，需要根据key对节点进行排序。TreeMap可以保证所有的key-value对处于有序状态。同样，TreeMap也有两种排序方式: 自然排序、定制排序

#### 5.6 WeakHashMap
WeakHashMap与HashMap的用法基本相似。区别在于，HashMap的key保留了对实际对象的"强引用"，这意味着只要该HashMap对象不被销毁，该HashMap所引用的对象就不会被垃圾回收。　　但WeakHashMap的key只保留了对实际对象的弱引用，这意味着如果WeakHashMap对象的key所引用的对象没有被其他强引用变量所引用，则这些key所引用的对象可能被垃圾回收，当垃　　圾回收了该key所对应的实际对象之后，WeakHashMap也可能自动删除这些key所对应的key-value对

#### 5.7 IdentityHashMap

IdentityHashMap的实现机制与HashMap基本相似，在IdentityHashMap中，当且仅当两个key严格相等(key1 == key2)时，IdentityHashMap才认为两个key相等

#### 5.8 EnumMap

EnumMap是一个与枚举类一起使用的Map实现，EnumMap中的所有key都必须是单个枚举类的枚举值。创建EnumMap时必须显式或隐式指定它对应的枚举类。EnumMap根据key的自然顺序　　(即枚举值在枚举类中的定义顺序)

### 六、CopyOn……

在JDK中提供了CopyOnWriteArrayList类和CopyOnWriteArraySet类

- 什么是写时复制(Copy-On-Write)容器？写时复制是指：在并发访问的情景下，当需要修改JAVA中Containers的元素时，不直接修改该容器，而是先复制一份副本，在副本上进行修改。修改完成之后，将指向原来容器的引用指向新的容器(副本容器)。
- 写时复制带来的影响：①由于不会修改原始容器，只修改副本容器。因此，可以对原始容器进行并发地读。其次，实现了读操作与写操作的分离，读操作发生在原始容器上，写操作发生在副本容器上。②数据一致性问题：读操作的线程可能不会立即读取到新修改的数据，因为修改操作发生在副本上。但最终修改操作会完成并更新容器，因此这是最终一致性。

CopyOnWriteArrayList add (需要锁）：如果多个线程同时去写，多线程写的时候会Copy出N个副本出来，那么可能内存花销很大，所以用一个锁ReetrantLock锁住，一次只能一个线程去添加，这个线程是可重入的。
CopyOnWriteArrayList get (需要锁）：get直接get即可，因为获取的旧的值所以没有影响。

- ArrayList--->CopyOnWriteArrayList
- HashSet ---> CopyOnWriteArraySet
- HashMap--->ConcurrentHashMap

### 七、集合的优雅姿势——Stream

在 Stream 流出现以前，如果我们想对一个集合进行迭代，可能会使用forEach或者forin循环，如果在迭代过程中还需要进行一些判断，可能会需要多个循环。相同的功能，用Stream流加lambda表达式实现代码量大大减少（实际上循环次数也会有一定幅度减少），而且所做的操作越多，用 Stream 流的优势就越明显。因此 Stream 流的出现主要是为了简化迭代的操作，提高迭代效率。

#### 7.1 使用

![图片](images/WX20211005-173843@2-3x.png)

1. stream集合遍历forEach:
```
        List<String> a=new ArrayList<>();
        a.add("judy");
        a.add("Tom");
        //lambda表达式
        a.stream().forEach(s -> System.out.println(s));
        
        a.stream().forEach(s -> {
            System.out.println(s);
            System.out.println(2);
        });
```

2. stream条件过滤filter
   使用list.stream().filter()进行过滤条件，为true 条件成立才会执行下面语句
```
        List<String> a = new ArrayList<>();
        a.add("judy");
        a.add("Tom");
        a.add("   ");
        //lambda表达式  是judy才打印
        a.stream().filter(s -> s.equals("judy")).forEach(s -> System.out.println(s));
```
3. stream元素映射map
   将stream流中的元素映射到另一个流中，这个是在后期经常用到的，比如方法所接收的返回值是A,但是接收的却是B
```
List<String> alpha = Arrays.asList("Monkey", "Lion", "Giraffe", "Lemur");

//不使用Stream管道流
List<String> alphaUpper = new ArrayList<>();
for (String s : alpha) {
    alphaUpper.add(s.toUpperCase());
}
System.out.println(alphaUpper); //[MONKEY, LION, GIRAFFE, LEMUR]

// 使用Stream管道流
List<String> collect = alpha.stream().map(String::toUpperCase).collect(Collectors.toList());
//上面使用了方法引用，和下面的lambda表达式语法效果是一样的
//List<String> collect = alpha.stream().map(s -> s.toUpperCase()).collect(Collectors.toList());

System.out.println(collect); //[MONKEY, LION, GIRAFFE, LEMUR]
```
4. stream两个流合并成一个流contract
```
        Stream<String> streamA = Stream.of("张无忌","张翠山");
        Stream<String> streamB = Stream.of("美羊羊","喜羊羊");
        //写法1
        //Stream.concat(streamA, streamB).forEach(System.out::println);
        
        //写法2
       Stream<String> result=  Stream.concat(streamA, streamB);
       result.forEach(name-> System.out.println(name));
```
> 引用自：https://zhuanlan.zhihu.com/p/59230509

Stream有以下特性及优点：

- 无存储。Stream不是一种数据结构，它只是某种数据源的一个视图，数据源可以是一个数组，Java容器或I/O channel等。
- 为函数式编程而生。对Stream的任何修改都不会修改背后的数据源，比如对Stream执行过滤操作并不会删除被过滤的元素，而是会产生一个不包含被过滤元素的新Stream。
- 惰式执行。Stream上的操作并不会立即执行，只有等到用户真正需要结果的时候才会执行。
- 可消费性。Stream只能被“消费”一次，一旦遍历过就会失效，就像容器的迭代器那样，想要再次遍历必须重新生成。

不错的文章：

https://toutiao.io/posts/imbyvb/preview

https://segmentfault.com/a/1190000038361937

https://www.jianshu.com/p/dd5fb725331b

https://zhuanlan.zhihu.com/p/52579165

https://juejin.cn/s/java%20stream%E5%AE%9E%E7%8E%B0%E5%8E%9F%E7%90%86


### 八、选型

1. ArrayList和linkedlist

- ArrayList是实现了基于动态数组的数据结构，LinkedList基于链表的数据结构。
- 对于随机访问get和set，ArrayList绝对优于LinkedList，因为LinkedList要移动指针。
- 对于新增和删除操作add和remove，LinkedList比较占优势，因为ArrayList要移动数据。这一点要看实际情况的。若只对单条数据插入或删除，ArrayList的速度反而优于LinkedList。但若是批量随机的插入删除数据，LinkedList的速度大大优于ArrayList.因为ArrayList每插入一条数据，要移动插入点及之后的所有数据。

2. Hashtable和Hashmap
- 线程是否安全： HashMap 是非线程安全的，HashTable 是线程安全的；HashTable 内部的方法基本都经过synchronized 修饰。（并发下建议使用ConcurrentHashMap ，原因是并发下HashMap的Rehash 会造成元素之间会形成一个循环链表）；
- 效率： 因为线程安全的问题，HashMap 要比 HashTable 效率高一点。另外，HashTable 基本被淘汰，不要在代码中使用它；
- 对Null key 和Null value的支持： HashMap 中，null 可以作为键，这样的键只有一个，可以有一个或多个键所对应的值为 null。。但是在 HashTable 中 put 进的键值只要有一个 null，直接抛出 NullPointerException。
- 初始容量大小和每次扩充容量大小的不同 ： ①创建时如果不指定容量初始值，Hashtable 默认的初始大小为11，之后每次扩充，容量变为原来的2n+1。HashMap 默认的初始化大小为16。之后每次扩充，容量变为原来的2倍。②创建时如果给定了容量初始值，那么 Hashtable 会直接使用你给定的大小，而 HashMap 会将其扩充为2的幂次方大小（HashMap 中的tableSizeFor()方法保证）。也就是说 HashMap 总是使用2的幂作为哈希表的大小。
- 底层数据结构： JDK1.8 以后的 HashMap 在解决哈希冲突时有了较大的变化，当链表长度大于阈值（默认为8）时，将链表转化为红黑树，以减少搜索时间。Hashtable 没有这样的机制。

3. HashMap和TreeMap
- HashMap通过hashcode对其内容进行快速查找，而TreeMap中所有的元素都保持着某种固定的顺序，如果你需要得到一个有序的结果你就应该使用TreeMap（HashMap中元素的排列顺序是不固定的）。
- 在Map中插入、删除和定位元素，HashMap是最好的选择。但如果你要按自然顺序或自定义顺序遍历键，那么TreeMap会更好。使用HashMap要求添加的键类明确定义了hashCode()和equals()的实现。这个TreeMap没有调优选项，因为该树总处于平衡状态。
- HashMap：数组方式存储key/value，线程非安全，允许null作为key和value，key不可以重复，value允许重复，不保证元素迭代顺序是按照插入时的顺序，key的hash值是先计算key的hashcode值，然后再进行计算，每次容量扩容会重新计算所以key的hash值，会消耗资源，要求key必须重写equals和hashcode方法
- 默认初始容量16，加载因子0.75，扩容为旧容量乘2，查找元素快，如果key一样则比较value，如果value不一样，则按照链表结构存储value，就是一个key后面有多个value；
- TreeMap：基于红黑二叉树的NavigableMap的实现，线程非安全，不允许null，key不可以重复，value允许重复，存入TreeMap的元素应当实现Comparable接口或者实现Comparator接口，会按照排序后的顺序迭代元素。主要用于存入元素的时候对元素进行自动排序，迭代输出的时候就按排序顺序输出。

4. HashSet与TreeSet
   HashSet是基于hash算法实现的，性能优于TreeSet。通常使用HashSet，在我们需要对其中元素排序的时候才使用TreeSet。

### 九、关键问题

> 引用自：https://blog.csdn.net/qq_36520235/article/details/82417949，

> 这个更好：https://www.geek-share.com/detail/2810195384.html

1. Hashmap的结构，1.7和1.8有哪些区别

- JDK1.7用的是头插法，而JDK1.8及之后使用的都是尾插法，那么他们为什么要这样做呢？因为JDK1.7是用单链表进行的纵向延伸，当采用头插法时会容易出现逆序且环形链表死循环问题。但是在JDK1.8之后是因为加入了红黑树使用尾插法，能够避免出现逆序且链表死循环的问题。
- 扩容后数据存储位置的计算方式也不一样：1.在JDK1.7的时候是直接用hash值和需要扩容的二进制数进行&（这里就是为什么扩容的时候为啥一定必须是2的多少次幂的原因所在，因为如果只有2的n次幂的情况时最后一位二进制数才一定是1，这样能最大程度减少hash碰撞）（hash值 & length-1）
- 在JDK1.7的时候是先扩容后插入的，这样就会导致无论这一次插入是不是发生hash冲突都需要进行扩容，如果这次插入的并没有发生Hash冲突的话，那么就会造成一次无效扩容，但是在1.8的时候是先插入再扩容的，优点其实是因为为了减少这一次无效的扩容，原因就是如果这次插入没有发生Hash冲突的话，那么其实就不会造成扩容，但是在1.7的时候就会急造成扩容
- 而在JDK1.8的时候直接用了JDK1.7的时候计算的规律，也就是扩容前的原始位置+扩容的大小值=JDK1.8的计算方式，而不再是JDK1.7的那种异或的方法。但是这种方式就相当于只需要判断Hash值的新增参与运算的位是0还是1就直接迅速计算出了扩容后的储存方式。
- JDK1.7的时候使用的是数组+ 单链表的数据结构。但是在JDK1.8及之后时，使用的是数组+链表+红黑树的数据结构（当链表的深度达到8的时候，也就是默认阈值，就会自动扩容把链表转成红黑树的数据结构来把时间复杂度从O（n）变成O（logN）提高了效率）

> 引用自：https://segmentfault.com/a/1190000021084133

- 1.7中采用数组+链表，1.8采用的是数组+链表/红黑树，即在1.7中链表长度超过一定长度后就改成红黑树存储。
- 1.7扩容时需要重新计算哈希值和索引位置，1.8并不重新计算哈希值，巧妙地采用和扩容后容量进行&操作来计算新的索引位置。
- 1.7是采用表头插入法插入链表，1.8采用的是尾部插入法。
- 在1.7中采用表头插入法，在扩容时会改变链表中元素原本的顺序，以至于在并发场景下导致链表成环的问题；在1.8中采用尾部插入法，在扩容时会保持链表元素原本的顺序，就不会出现链表成环的问题了。
- hash值的计算：1.7的扰动处理经过4次位运算 + 5次异或运算；1.8只是1次位运算 + 1次异或处理。具体什么是扰动函数参考：【13. HashMap为什么要扰动函数？】

2. 为什么在JDK1.7的时候是先进行扩容后进行插入，而在JDK1.8的时候则是先插入后进行扩容的呢？

在JDK1.7中的话，是先进行扩容后进行插入的，就是当你发现你插入的桶是不是为空，如果不为空说明存在值就发生了hash冲突，那么就必须得扩容，但是如果不发生Hash冲突的话，说明当前桶是空的（后面并没有挂有链表），那就等到下一次发生Hash冲突的时候在进行扩容，但是当如果以后都没有发生hash冲突产生，那么就不会进行扩容了，减少了一次无用扩容，也减少了内存的使用

3. 为什么在JDK1.8中进行对HashMap优化的时候，把链表转化为红黑树的阈值是8,而不是7或者不是20呢（面试蘑菇街问过）？

- 如果选择6和8（如果链表小于等于6树还原转为链表，大于等于8转为树），中间有个差值7可以有效防止链表和树频繁转换。假设一下，如果设计成链表个数超过8则链表转换成树结构，链表个数小于8则树结构转换成链表，如果一个HashMap不停的插入、删除元素，链表个数在8左右徘徊，就会频繁的发生树转链表、链表转树，效率会很低。
- 还有一点重要的就是由于treenodes的大小大约是常规节点的两倍，因此我们仅在容器包含足够的节点以保证使用时才使用它们，当它们变得太小（由于移除或调整大小）时，它们会被转换回普通的node节点，容器中节点分布在hash桶中的频率遵循泊松分布，桶的长度超过8的概率非常非常小。所以作者应该是根据概率统计而选择了8作为阀值

> 引用自：https://zhuanlan.zhihu.com/p/91636401

4. HashMap 总是使用2的幂作为哈希表的大小的原因

为了加快哈希计算以及减少哈希冲突。

- 为什么可以加快计算？我们都知道为了找到 KEY 的位置在哈希表的哪个槽里面，需要计算 hash(KEY) % 数组长度，但是！% 计算比 & 慢很多，所以用 & 代替 %，为了保证 & 的计算结果等于 % 的结果需要把 length 减 1。也就是 hash(KEY) & (length - 1)这个 hash(KEY) 没什么可说的，调用 Object 里面的 native 方法完成计算，一般返回的是一个整数，至于是偶数还是奇数就不一定了。
- 为什么可以减少冲突？假设现在数组的长度 length 可能是偶数也可能是奇数。length 为偶数时，length-1 为奇数，奇数的二进制最后一位是 1，这样便保证了 hash &(length-1) 的最后一位可能为 0，也可能为 1（这取决于 h 的值），即 & 运算后的结果可能为偶数，也可能为奇数，这样便可以保证散列的均匀性。而如果 length 为奇数的话，很明显 length-1 为偶数，它的最后一位是 0，这样 hash & (length-1) 的最后一位肯定为 0，即只能为偶数，这样任何 hash 值都只会被散列到数组的偶数下标位置上，这便浪费了近一半的空间。


> 引用自：https://blog.csdn.net/qq_36520235/article/details/82417949

5. HashMap 中的 key若 Object类型， 则需实现哪些方法？
- hashcode()：计算需要存储数据的位置，如果计算不当会导致很严重的哈希冲突。
- equals()：比较存储的位置上是否存在需要存储数据的key，如果存在的话就替换，如不存在就写入。其目的是为了保证key再hashmap中的唯一性。

6. 为什么HashMap为什么要树化？

本质上这是个安全问题。因为在元素放置过程中，如果一个对象哈希冲突，都被放置到同一个桶里，则会形成一个链表，我们知道链表查询是线性的，会严重影响存取的性能。而在现实世界，构造哈希冲突的数据并不是非常复杂的事情，恶意代码就可以利用这些数据大量与服务器端交互，导致服务器端CPU大量占用，这就构成了哈希碰撞拒绝服务攻击，国内一线互联网公司就发生过类似攻击事件。

用哈希碰撞发起拒绝服务攻击(DOS，Denial-Of-Service attack),常见的场景是攻击者可以事先构造大量相同哈希值的数据，然后以JSON数据的形式发送给服务器，服务器端在将其构建成为Java对象过程中，通常以Hashtable或HashMap等形式存储，哈希碰撞将导致哈希表发生严重退化，算法复杂度可能上升一个数据级，进而耗费大量CPU资源。

> 引用自：https://juejin.cn/post/6844904120743264264

7. ConcurrentHashMap版本1.7和1.8的区别

- JDK1.7的ConcurrentHashMap：首先将数据分为一段一段的存储，然后给每一段数据配一把锁，当一个线程占用锁访问其中一个段数据时，其他段的数据也能被其他线程访问。是由 Segment 数组结构和 HashEntry 数组结构组成。Segment 实现了 ReentrantLock,所以 Segment 是一种可重入锁，扮演锁的角色。HashEntry 用于存储键值对数据。一个 ConcurrentHashMap 里包含一个 Segment 数组。Segment 的结构和HashMap类似，是一种数组和链表结构，一个 Segment 包含一个 HashEntry 数组，每个 HashEntry 是一个链表结构的元素，每个 Segment 守护着一个HashEntry数组里的元素，当对 HashEntry 数组的数据进行修改时，必须首先获得对应的 Segment的锁。
- JDK1.8的ConcurrentHashMap（TreeBin: 红黑二叉树节点 Node: 链表节点）：ConcurrentHashMap取消了Segment分段锁，采用CAS和synchronized来保证并发安全。数据结构跟HashMap1.8的结构类似，数组+链表/红黑二叉树。Java 8在链表长度超过一定阈值（8）时将链表（寻址时间复杂度为O(N)）转换为红黑树（寻址时间复杂度为O(log(N))）synchronized只锁定当前链表或红黑二叉树的首节点，这样只要hash不冲突，就不会产生并发，效率又有所提升。

8. 哪些集合类是线程安全的？

- vector：就比arraylist多了个同步化机制（线程安全），因为效率较低，现在已经不太建议使用。在web应用中，特别是前台页面，往往效率（页面响应速度）是优先考虑的。
- statck：堆栈类，先进后出。继承自Vector。
- hashtable：就比hashmap多了个线程安全。
- enumeration：枚举，相当于迭代器。
- StringBuffer 线程安全：

9. ConcurrentHashMap与Hashtable：

- 底层数据结构： JDK1.7的 ConcurrentHashMap 底层采用 分段的数组+链表 实现，JDK1.8 采用的数据结构跟HashMap1.8的结构一样，数组+链表/红黑二叉树。Hashtable 和 JDK1.8 之前的 HashMap 的底层数据结构类似都是采用 数组+链表 的形式，数组是 HashMap 的主体，链表则是主要为了解决哈希冲突而存在的；
- 实现线程安全的方式（重要）：① 在JDK1.7的时候，ConcurrentHashMap（分段锁） 对整个桶数组进行了分割分段(Segment)，每一把锁只锁容器其中一部分数据，多线程访问容器里不同数据段的数据，就不会存在锁竞争，提高并发访问率。 到了 JDK1.8 的时候已经摒弃了Segment的概念，而是直接用 Node 数组+链表+红黑树的数据结构来实现，并发控制使用 synchronized 和 CAS 来操作。（JDK1.6以后 对 synchronized锁做了很多优化） 看起来就像是优化过且线程安全的 HashMap，虽然在JDK1.8中还能看到 Segment 的数据结构，但是已经简化了属性，只是为了兼容旧版本；② Hashtable(同一把锁) :使用 synchronized 来保证线程安全，效率非常低下。当一个线程访问同步方法时，其他线程也访问同步方法，可能会进入阻塞或轮询状态，如使用 put 添加元素，另一个线程不能使用 put 添加元素，也不能使用 get，竞争会越来越激烈效率越低。

10. 集合中涉及的排序：Comparable与Comparator

- comparable接口实际上是出自java.lang包 它有一个 compareTo(Object obj)方法用来排序
- comparator接口实际上是出自 java.util 包它有一个compare(Object obj1, Object obj2)方法用来排序

一般我们需要对一个集合使用自定义排序时，我们就要重写compareTo()方法或compare()方法，当我们需要对某一个集合实现两种排序方式，比如一个song对象中的歌名和歌手名分别采用一种排序方法的话，我们可以重写compareTo()方法和使用自制的Comparator方法或者以两个Comparator来实现歌名排序和歌星名排序。

11. 迭代器使用
```
        // 创建集合
        ArrayList<String> sites = new ArrayList<String>();
        sites.add("Google");
        sites.add("Runoob");
        sites.add("Taobao");
        sites.add("Zhihu");

        // 获取迭代器
        Iterator<String> it = sites.iterator();

        // 输出集合中的所有元素
        while(it.hasNext()) {
            System.out.println(it.next());
        }
```

12. 迭代map
```
Map<Integer, Integer> map = new HashMap<Integer, Integer>();
for (Map.Entry<Integer, Integer> entry : map.entrySet()) {
    System.out.println("Key = " + entry.getKey() + ", Value = " + entry.getValue());
}

Map<Integer, Integer> map = new HashMap<Integer, Integer>();
Iterator<Map.Entry<Integer, Integer>> entries = map.entrySet().iterator();
while (entries.hasNext()) {
    Map.Entry<Integer, Integer> entry = entries.next();
    System.out.println("Key = " + entry.getKey() + ", Value = " + entry.getValue());
}

```

13. HashMap为什么要扰动函数？

在 HashMap 存放元素时候有这样一段代码来处理哈希值，这是 java 8 的散列值扰动函数，用于优化散列效果；

1.7版本
```
final int hash(Object k) {
    int h = hashSeed;
    if (0 != h && k instanceof String) {
        return sun.misc.Hashing.stringHash32((String) k);
    }
    h ^= k.hashCode();
    h ^= (h >>> 20) ^ (h >>> 12);
    return h ^ (h >>> 7) ^ (h >>> 4);
}
```

1.8版本
```
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```

14. 负载因子的作用

- 负载因子越大，数组要被填满时，元素就会越多，元素越多，冲突的几率就会越大，一个链表存的元素也会越多，查询的时候就会越慢。但是，此时空间的利用率更高了——空间换时间
- 负载因此越小，数组要被填满时，元素就会越少，冲突也会也少，一个链表的元素也会越少，查询的时候也就越快。但是，空间的利用率低了——-时间换空间。

15. 为什么负载因子是0.75

小于0.5，空着一半就扩容了，这在心理上很多人都会觉得不合理吧，空间肯定会很浪费；但是如果是1的话，只能说有超级大的概率，会发生碰撞，这不符合我们的初衷。当时因为已经设置了hashtable的长度为16。其实负载因子并不重要，重要的其实是那个阈值。负载因子也是为了计算那个阈值的。上面也提到了0.5~1之间找一个小数，乘16可以是一个整数时候0.75很合适。

16. 你知道 HashMap 的哈希函数怎么设计的吗？
    hash 函数是先拿到通过 key 的 hashcode，是 32 位的 int 值，然后让 hashcode 的高 16 位和低 16 位进行异或操作。一定要尽可能降低 hash 碰撞，越分散越好；算法一定要尽可能高效，因为这是高频操作, 因此采用位运算；因为 key.hashCode()函数调用的是 key 键值类型自带的哈希函数，返回 int 型散列值。int 值范围为-2147483648~2147483647，前后加起来大概 40 亿的映射空间。只要哈希函数映射得比较均匀松散，一般应用是很难出现碰撞的。但问题是一个 40 亿长度的数组，内存是放不下的。

17. 1.8 四点主要的优化：
- 数组+链表改成了数组+链表或红黑树；防止发生 hash 冲突，链表长度过长，将时间复杂度由O(n)降为O(logn);
- 链表的插入方式从头插法改成了尾插法，简单说就是插入时，如果数组位置上已经有元素，1.7 将新元素放到数组中，原始节点作为新节点的后继节点，1.8遍历链表，将元素放置到链表的最后；因为1.7头插法扩容时，头插法会使链表发生反转，多线程环境下会产生环；A 线程在插入节点 B，B 线程也在插入，遇到容量不够开始扩容，重新 hash，放置元素，采用头插法，后遍历到的 B 节点放入了头部，这样形成了环。
- 扩容的时候 1.7 需要对原数组中的元素进行重新 hash 定位在新数组的位置，1.8 采用更简单的判断逻辑，位置不变或索引+旧容量大小；
- 在插入时，1.7 先判断是否需要扩容，再插入，1.8 先进行插入，插入完成再判断是否需要扩容；

> 引用自：https://blog.csdn.net/weixin_42373997/article/details/112085344

18. 平常怎么解决这个线程不安全的问题？

安琪拉: Java 中有 HashTable、Collections.synchronizedMap、以及 ConcurrentHashMap 可以实现线程安全的 Map。HashTable 是直接在操作方法上加 synchronized 关键字，锁住整个数组，粒度比较大，Collections.synchronizedMap 是使用 Collections 集合工具的内部类，通过传入 Map 封装出一个 SynchronizedMap 对象，内部定义了一个对象锁，方法内通过对象锁实现；ConcurrentHashMap 使用分段锁，降低了锁粒度，让并发度大大提高。

19. ConcurrentHashMap 的分段锁的实现原理

ConcurrentHashMap 成员变量使用 volatile 修饰，免除了指令重排序，同时保证内存可见性，另外使用 CAS 操作和 synchronized 结合实现赋值操作，多线程操作只会锁住当前操作索引的节点。

20. 链表转红黑树是链表长度达到阈值，这个阈值是多少？

阈值是8，红黑树转链表阈值为6。在hash函数设计合理的情况下，发生hash碰撞8次的几率为百万分之6，概率说话。。因为8够用了，至于为什么转回来是6，因为如果hash碰撞次数在8附近徘徊，会一直发生链表和红黑树的转化，为了预防这种情况的发生。

21. 那有没有有序的 Map？

- LinkedHashMap 内部维护了一个单链表，有头尾节点，同时 LinkedHashMap 节点 Entry 内部除了继承 HashMap 的 Node 属性，还有 before 和 after 用于标识前置节点和后置节点。可以实现按插入的顺序或访问顺序排序。
- TreeMap 是按照 Key 的自然顺序或者 Comprator 的顺序进行排序，内部是通过红黑树来实现。所以要么 key 所属的类实现 Comparable 接口，或者自定义一个实现了 Comparator 接口的比较器，传给 TreeMap 用户 key 的比较。

22. ConcurrentModificationException什么时候会发生？

当数据集在使用时尝试做出修改会抛出java.util.ConcurrentModificationException，也就是当我们在进行数据集的迭代时进行修改。CopyOnWriteArrayList？这个类在java.util.concurrent包中且实现了list接口。它内建了一个内部ArrayList的克隆副本来实现所有的操作和修改。它很安全并且在迭代中永远不会抛出ConcurrentModificationException。

23. 解释一下iterator与collection集合。

Iterator只能通过next()方法来移动和读取下一个元素，remove()也是一样。Collection，可以通过add(),iterator(),remove()和clear()来添加，iterate，删除和清楚整个数据结构。同时其也有一些boolean方法。由于Iterator相对于collection有更少的操作所以它更快。

24. 解释下fail-fast与fail-safe的不同

- Fail-fast：使用了原生collection来遍历；当迭代进行时不能修改集合；会抛出ConcurrentModicationException异常
- Fail-safe：使用了原生集合的复制版进行遍历；在迭代进行中可以修改集合；不会抛出任何异常

其他一些题目

https://mp.weixin.qq.com/s/Swi-zAyxbjOoSBCR23l4Jw

https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzIwMTgzOTQ0Ng==&action=getalbum&album_id=1879005764384587778&scene=173&from_msgid=2247485877&from_itemidx=1&count=3&nolastread=1#wechat_redirect

