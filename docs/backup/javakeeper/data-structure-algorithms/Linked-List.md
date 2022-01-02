# 链表

与数组相似，链表也是一种`线性`数据结构。

链表是一系列的存储数据元素的单元通过指针串接起来形成的，因此每个单元至少有两个域，一个域用于数据元素的存储，另一个域是指向其他单元的指针。这里具有一个数据域和多个指针域的存储单元通常称为**结点**（node）。



## 单链表

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gh5uzihd52j30io078wer.jpg)

一种最简单的结点结构如上图所示，它是构成单链表的基本结点结构。在结点中数据域用来存储数据元素，指针域用于指向下一个具有相同结构的结点。

单链表中的每个结点不仅包含值，还包含链接到下一个结点的`引用字段`。通过这种方式，单链表将所有结点按顺序组织起来。

![](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/img/20200915173602.png)

链表的第一个结点和最后一个结点，分别称为链表的**首结点**和**尾结点**。尾结点的特征是其 next 引用为空（null）。链表中每个结点的 next 引用都相当于一个指针，指向另一个结点，借助这些 next 引用，我们可以从链表的首结点移动到尾结点。如此定义的结点就称为**单链表**（single linked list）。

上图蓝色箭头显示单个链接列表中的结点是如何组合在一起的。

在单链表中通常使用 head 引用来指向链表的首结点，由 head 引用可以完成对整个链表中所有节点的访问。有时也可以根据需要使用指向尾结点的 tail 引用来方便某些操作的实现。

在单链表结构中还需要注意的一点是，由于每个结点的数据域都是一个 Object 类的对象，因此，每个数据元素并非真正如图中那样，而是在结点中的数据域通过一个 Object 类的对象引用来指向数据元素的。

与数组类似，单链表中的结点也具有一个线性次序，即如果结点 P 的 next 引用指向结点 S，则 P 就是 S 的**直接前驱**，S 是 P 的**直接后续**。<mark>单链表的一个重要特性就是只能通过前驱结点找到后续结点，而无法从后续结点找到前驱结点</mark>。

接着我们来看下单链表的 CRUD：

以下是单链表中结点的典型定义：

```java
// Definition for singly-linked list.
public class SinglyListNode {
    int val;
    SinglyListNode next;
    SinglyListNode(int x) { val = x; }
}
```

### 查找

与数组不同，我们无法在常量时间内访问单链表中的随机元素。 如果我们想要获得第 i 个元素，我们必须从头结点逐个遍历。 我们按索引来访问元素平均要花费 $O(N)$ 时间，其中 N 是链表的长度。

例如需要在单链表中查找是否包含某个数据元素 e，则方法是使用一个循环变量 p，起始时从单链表的头结点开始，每次循环判断 p 所指结点的数据域是否和 e 相同，如果相同则可以返回 true，否则继续循环直到链表中所有结点均被访问，此时 p 为 null。

使用 Java 语言实现整个过程的关键语句是：

```java
p=head;
while (p!=null)
if (strategy.equal( e , p.getData() )) return true;
return false;
```



### 添加

单链表中数据元素的插入，是通过在链表中插入数据元素所属的结点来完成的。对于链表的不同位置，插入的过程会有细微的差别。

![](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/img/20200915174050.png)

除了单链表的首结点由于没有直接前驱结点，所以可以直接在首结点之前插入一个新的结点之外，在单链表中的其他任何位置插入一个新结点时，都只能是在已知某个特定结点引用的基础上在其后面插入一个新结点。并且在已知单链表中某个结点引用的基础上，完成结点的插入操作需要的时间是 $O(1)$。

> 思考：如果是带头结点的单链表进行插入操作，是什么样子呢？



### 删除

类似的，在单链表中数据元素的删除也是通过结点的删除来完成的。在链表的不同位置删除结点，其操作过程也会有一些差别。

![](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/img/20200915174447.png)

在单链表中删除一个结点时，除首结点外都必须知道该结点的直接前驱结点的引用。并且在已知单链表中某个结点引用的基础上，完成其后续结点的删除操作需要的时间是 $O(1)$。

> 在使用单链表实现线性表的时候，为了使程序更加简洁，我们通常在单链表的最前面添加一个**哑元结点**，也称为头结点。在头结点中不存储任何实质的数据对象，其 next 域指向线性表中 0 号元素所在的结点，头结点的引入可以使线性表运算中的一些边界条件更容易处理。
>
> 对于任何基于序号的插入、删除，以及任何基于数据元素所在结点的前面或后面的插入、删除，在带头结点的单链表中均可转化为在某个特定结点之后完成结点的插入、删除，而不用考虑插入、删除是在链表的首部、中间、还是尾部等不同情况。

![](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/img/20200915174846.png)

## 双向链表

单链表的一个优点是结构简单，但是它也有一个缺点，即在单链表中只能通过一个结点的引用访问其后续结点，而无法直接访问其前驱结点，要在单链表中找到某个结点的前驱结点，必须从链表的首结点出发依次向后寻找，但是需要 $Ο(n)$ 时间。

所以我们在单链表结点结构中新增加一个域，该域用于指向结点的直接前驱结点。

![](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/img/20200915175036.png)

双向链表是通过上述定义的结点使用 pre 以及 next 域依次串联在一起而形成的。一个双向链表的结构如下图所示。

![](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/img/20200915175120.png)

接着我们来看下双向链表的 CRUD：

以下是双链表中结点的典型定义：

```java
// Definition for doubly-linked list.
class DoublyListNode {
    int val;
    DoublyListNode next, prev;
    DoublyListNode(int x) {val = x;}
}
```

### 查找

在双向链表中进行查找与在单链表中类似，只不过在双向链表中查找操作可以从链表的首结点开始，也可以从尾结点开始，但是需要的时间和在单链表中一样。

### 添加

单链表的插入操作，除了首结点之外必须在某个已知结点后面进行，而在双向链表中插入操作在一个已知的结点之前或之后都可以进行，如下表示在结点 p(11) 之前 插入 s(9)。

![](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/img/20200915175312.png)

使用 Java 语言实现整个过程的关键语句是

```java
s.setPre (p.getPre()); 
p.getPre().setNext(s);
s.setNext(p);
p.setPre(s);
```

在结点 p 之后插入一个新结点的操作与上述操作对称，这里不再赘述。

插入操作除了上述情况，还可以在双向链表的首结点之前、双向链表的尾结点之后进行，此时插入操作与上述插入操作相比更为简单。

### 删除

单链表的删除操作，除了首结点之外必须在知道待删结点的前驱结点的基础上才能进行，而在双向链表中在已知某个结点引用的前提下，可以完成该结点自身的删除。如下表示删除 p(16) 的过程。

![](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/img/20200915175511.png)

使用 Java 语言实现整个过程的关键语句是

```java
p.getPre().setNext(p.getNext());
p.getNext().setPre(p.getPre());
```

 

对线性表的操作，无非就是排序、加法、减法、反转，说的好像很简单，我们开始刷题。



## 刷题

### 反转链表(206)

>反转一个单链表。
>
>```
>输入: 1->2->3->4->5->NULL
>输出: 5->4->3->2->1->NULL
>```

**进阶:** 你可以迭代或递归地反转链表。你能否用两种方法解决这道题？

**题目解析**

1. 定义两个指针： pre 和 cur ；pre 在前 cur 在后。
2. 每次让 pre 的 next 指向 cur ，实现一次局部反转
3. 局部反转完成之后，pre 和 cur 同时往前移动一个位置
4. 循环上述过程，直至 pre 到达链表尾部

**动画描述**

![迭代.gif](https://pic.leetcode-cn.com/7d8712af4fbb870537607b1dd95d66c248eb178db4319919c32d9304ee85b602-%E8%BF%AD%E4%BB%A3.gif)

两个指针，最开始就把指针位置倒着放，然后遍历替换数字，最后返回 pre 就行

```java
public ListNode reverseList_1(ListNode head){
  if(head == null || head.next == null){
    return head;
  }
  //申请节点，pre和 cur，pre指向null
  ListNode cur = head;
  ListNode pre = null;
  while(cur != null) {
    //记录当前节点的下一个节点
    ListNode tmp = cur.next;
    //然后将当前节点指向pre
    cur.next = pre;
    //pre和cur节点都前进一位
    pre = cur;
    cur = tmp;
  }
  return pre;
}
```



### [环形链表(141)](https://leetcode-cn.com/problems/linked-list-cycle/)

> 给定一个链表，判断链表中是否有环。
>
> 为了表示给定链表中的环，我们使用整数 `pos` 来表示链表尾连接到链表中的位置（索引从 0 开始）。 如果 `pos` 是 `-1`，则在该链表中没有环。
>
> ```
> 输入：head = [3,2,0,-4], pos = 1
> 输出：true
> 解释：链表中有一个环，其尾部连接到第二个节点。
> ```
>
> ![img](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/07/circularlinkedlist.png)

**题目解析**

这道题是快慢指针的**经典应用**。

设置两个指针，一个每次走一步的**慢指针**和一个每次走两步的**快指针**。

- 如果不含有环，跑得快的那个指针最终会遇到 null，说明链表不含环
- 如果含有环，快指针会超慢指针一圈，和慢指针相遇，说明链表含有环。

![img](https://github.com/MisterBooo/LeetCodeAnimation/raw/master/0141-Linked-List-Cycle/Animation/Animation.gif)

```java
public boolean hasCycle(ListNode head) {
  if (head == null || head.next == null) {
    return false;
  }
  // 龟兔起跑
  ListNode fast = head;
  ListNode slow = head;

  while (fast != null && fast.next != null) {
    // 龟走一步
    slow = slow.next;
    // 兔走两步
    fast = fast.next.next;
    if (slow == fast) {
      return true;
    }
  }
  return false;
}
```





### 相交链表(160)

> ![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/14/160_example_1.png)
>
> 输入：intersectVal = 8, listA = [4,1,8,4,5], listB = [5,0,1,8,4,5], skipA = 2, skipB = 3
> 输出：Reference of the node with value = 8
> 输入解释：相交节点的值为 8 （注意，如果两个链表相交则不能为 0）。从各自的表头开始算起，链表 A 为 [4,1,8,4,5]，链表 B 为 [5,0,1,8,4,5]。在 A 中，相交节点前有 2 个节点；在 B 中，相交节点前有 3 个节点。

**题目解析** 

为满足题目时间复杂度和空间复杂度的要求，我们可以使用双指针法。

- 创建两个指针 pA 和 pB 分别指向链表的头结点 headA 和 headB。
- 当 pA 到达链表的尾部时，将它重新定位到链表B的头结点 headB，同理，当 pB 到达链表的尾部时，将它重新定位到链表 A 的头结点 headA。
- 当 pA 与 pB 相等时便是两个链表第一个相交的结点。 这里其实就是相当于把两个链表拼在一起了。pA 指针是按 B 链表拼在 A 链表后面组成的新链表遍历，而 pB 指针是按A链表拼在B链表后面组成的新链表遍历。举个简单的例子： A链表：{1,2,3,4} B链表：{6,3,4} pA按新拼接的链表{1,2,3,4,6,3,4}遍历 pB按新拼接的链表{6,3,4,1,2,3,4}遍历

![](https://github.com/MisterBooo/LeetCodeAnimation/raw/master/0160-Intersection-of-Two-Linked-Lists/Animation/Animation.gif)

```java
public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
    if (headA == null || headB == null) {
        return null;
    }
    ListNode pA = headA, pB = headB;
    while (pA != pB) {
        pA = pA == null ? headB : pA.next;
        pB = pB == null ? headA : pB.next;
    }
    return pA;
}
```



### 合并两个有序链表(21)

> 将两个升序链表合并为一个新的 **升序** 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。 
>
>  **示例：**
>
> ```
> 输入：1->2->4, 1->3->4
> 输出：1->1->2->3->4->4
> ```

如果 l1 或者 l2 一开始就是空链表 ，那么没有任何操作需要合并，所以我们只需要返回非空链表。否则，我们要判断 l1 和 l2 哪一个链表的头节点的值更小，然后递归地决定下一个添加到结果里的节点。如果两个链表有一个为空，递归结束。

![img](https://pic.leetcode-cn.com/fe5eca7edea29a76316f7e8529f73a90ae4990fd66fea093c6ee91567788e482-%E5%B9%BB%E7%81%AF%E7%89%874.JPG)

```java
public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
    if (l1 == null) {
        return l2;
    } else if (l2 == null) {
        return l1;
    } else if (l1.val < l2.val) {
        l1.next = mergeTwoLists(l1.next, l2);
        return l1;
    } else {
        l2.next = mergeTwoLists(l1, l2.next);
        return l2;
    }
}
```



### 回文链表(234)

> 请判断一个链表是否为回文链表。
>
> ```
>输入: 1->2
> 输出: false
> ```
> 
> ```
>输入: 1->2->2->1
> 输出: true
>```

**解法1：**

1. 复制链表值到数组列表中。
2. 使用双指针法判断是否为回文。

![01](https://github.com/MisterBooo/LeetCodeAnimation/raw/master/0234-isPalindrome/Animation/solved01.gif)

```java
public static boolean isPalindrome_me(ListNode head){
  if(head == null || head.next == null){
    return false;
  }
  List<Integer> list = new ArrayList<>();
  while(head != null){
    list.add(head.val);
    head = head.next;
  }
  Integer[] arrs = list.toArray(new Integer[list.size()]);

  int tmp = 0;
  for(int i=0;i<arrs.length/2;i++){ //注意这里只遍历到一半就可以了
    if(arrs[i]== arrs[arrs.length-i-1]){
      tmp++;
    }
  }
  // 双指针，tmp 一直往前走，都相等的话肯定等于数据的一半
  return tmp == arrs.length / 2;
}
```

**解法2：**

我们先找到链表的中间结点，然后将中间结点后面的链表进行反转，反转之后再和前半部分链表进行比较，如果相同则表示该链表属于回文链表，返回true；否则，否则返回false

![02](https://github.com/MisterBooo/LeetCodeAnimation/raw/master/0234-isPalindrome/Animation/solved02.gif)







### 两数相加(2)

> 给出两个 非空 的链表用来表示两个非负的整数。其中，它们各自的位数是按照 逆序 的方式存储的，并且它们的每个节点只能存储 一位 数字。
>
> 如果，我们将这两个数相加起来，则会返回一个新的链表来表示它们的和。
>
> 您可以假设除了数字 0 之外，这两个数都不会以 0 开头。
>
> ```
> 输入：(2 -> 4 -> 3) + (5 -> 6 -> 4)
> 输出：7 -> 0 -> 8
> 原因：342 + 465 = 807
> ```

```java
public static ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode pre = new ListNode(0);
        ListNode cur = pre;
        //进位
        int carry = 0;
        while(l1 != null || l2 != null) {
            int x = l1 == null ? 0 : l1.val;
            int y = l2 == null ? 0 : l2.val;
            int sum = x + y + carry;

            //如果大于10了，就进位
            carry = sum / 10;
            //进位后剩下的余数
            sum = sum % 10;
            //进位后的数据
            cur.next = new ListNode(sum);
            cur = cur.next;
            //往后移动
            if(l1 != null) {
                l1 = l1.next;
            }
            if(l2 != null) {
                l2 = l2.next;
            }
        }
        //如果最后一位还有进位的话，再往后增加一个节点
        if(carry == 1) {
            cur.next = new ListNode(carry);
        }
        return pre.next;
    }
```



### [LRU 缓存机制(146)](https://leetcode-cn.com/problems/lru-cache/)

> 运用你所掌握的数据结构，设计和实现一个  LRU (最近最少使用) 缓存机制 。实现 LRUCache 类：
>
> - LRUCache(int capacity) 以正整数作为容量 capacity 初始化 LRU 缓存
> - int get(int key) 如果关键字 key 存在于缓存中，则返回关键字的值，否则返回 -1 。
> - void put(int key, int value) 如果关键字已经存在，则变更其数据值；如果关键字不存在，则插入该组「关键字-值」。当缓存容量达到上限时，它应该在写入新数据之前删除最久未使用的数据值，从而为新的数据值留出空间。
>
> ```
> 输入
> ["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
> [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
> 输出
> [null, null, null, 1, null, -1, null, -1, 3, 4]
> 
> 解释
> LRUCache lRUCache = new LRUCache(2);
> lRUCache.put(1, 1); // 缓存是 {1=1}
> lRUCache.put(2, 2); // 缓存是 {1=1, 2=2}
> lRUCache.get(1);    // 返回 1
> lRUCache.put(3, 3); // 该操作会使得关键字 2 作废，缓存是 {1=1, 3=3}
> lRUCache.get(2);    // 返回 -1 (未找到)
> lRUCache.put(4, 4); // 该操作会使得关键字 1 作废，缓存是 {4=4, 3=3}
> lRUCache.get(1);    // 返回 -1 (未找到)
> lRUCache.get(3);    // 返回 3
> lRUCache.get(4);    // 返回 4
> ```

分析上面的操作过程，要让 put 和 get 方法的时间复杂度为 O(1)，我们可以总结出 cache 这个数据结构必要的条件：查找快，插入快，删除快，有顺序之分。

因为显然 cache 必须有顺序之分，以区分最近使用的和久未使用的数据；而且我们要在 cache 中查找键是否已存在；如果容量满了要删除最后一个数据；每次访问还要把数据插入到队头。

那么，什么数据结构同时符合上述条件呢？哈希表查找快，但是数据无固定顺序；链表有顺序之分，插入删除快，但是查找慢。所以结合一下，形成一种新的数据结构：**哈希链表**。

![HashLinkedList](https://pic.leetcode-cn.com/b84cf65debb43b28bd212787ca63d34c9962696ed427f638763be71a3cb8f89d.jpg)

```java
// key 映射到 Node(key, val)
HashMap<Integer, Node> map;
// Node(k1, v1) <-> Node(k2, v2)...
DoubleList cache;

int get(int key) {
    if (key 不存在) {
        return -1;
    } else {        
        将数据 (key, val) 提到开头；
        return val;
    }
}

void put(int key, int val) {
    Node x = new Node(key, val);
    if (key 已存在) {
        把旧的数据删除；
        将新节点 x 插入到开头；
    } else {
        if (cache 已满) {
            删除链表的最后一个数据腾位置；
            删除 map 中映射到该数据的键；
        } 
        将新节点 x 插入到开头；
        map 中新建 key 对新节点 x 的映射；
    }
}
```





### [删除链表的倒数第 N 个结点（19）](https://leetcode-cn.com/problems/remove-nth-node-from-end-of-list/)

> 给定一个链表，删除链表的倒数第 n 个节点，并且返回链表的头结点。
>
> ```
>给定一个链表: 1->2->3->4->5, 和 n = 2.
> 
>当删除了倒数第二个节点后，链表变为 1->2->3->5.
> ```

```java
public ListNode removeNthFromEnd_1(ListNode head, int n) {
        ListNode pre = new ListNode(0,head);
        int length = getLength(head);
        ListNode cur = pre;
        //遍历到需要删除的位置的前一个，比如1，2，3，4，5 遍历到第 < 4 就可以了
        for (int i=1;i<length-n+1;i++){
            cur = cur.next;
        }
        // 删除节点，返回哑结点后的结果即可
        cur.next = cur.next.next;
        ListNode ans = pre.next;
        return ans;
    }

    public int getLength(ListNode head){
        int length = 0;
        while (head != null){
            ++length;
            head=head.next;
        }
        return length;
    }
```



### [排序链表（148）](https://leetcode-cn.com/problems/sort-list/)

> 给你链表的头结点 `head` ，请将其按 **升序** 排列并返回 **排序后的链表** 。
>
> 在 *O*(*n* log *n*) 时间复杂度和常数级空间复杂度下，对链表进行排序。
>
> **示例 1:**
>
> ```
> 输入: 4->2->1->3
> 输出: 1->2->3->4
> ```

**解答一：归并排序（递归法）**

**解答二：归并排序（从底至顶直接合并）**











## 参考与感谢

- https://aleej.com/2019/09/16/数据结构与算法之美学习笔记