# 前言
>文本已收录至我的GitHub仓库，欢迎Star：https://github.com/bin392328206/six-finger                             
> **种一棵树最好的时间是十年前，其次是现在**   
>我知道很多人不玩**qq**了,但是怀旧一下,欢迎加入六脉神剑Java菜鸟学习群，群聊号码：**549684836** 鼓励大家在技术的路上写博客
## 絮叨 
> 上一篇的集合的父接口 Collection 和 Iterator 大家应该都很了解了吧，上一篇是基础，大家还是很有必要好好去学习一下   
[🔥史上最全的Java容器集合之入门](https://juejin.im/post/5de87a92e51d4557ec02f39d)   
>这一篇 带领大家来解密，我们容器的基础数据结构，为啥有这篇呢，本来想直接写容器的，但是写到一半，发现自己的数据结构也不是很好，所以带大家了解一下简单的数据结构。

## 数组

>第一个数组是一种效率最高的存储和随机访问的方式    
> 数组是一种连续存储线性结构，元素类型相同，大小相等,存取速度快

![](https://user-gold-cdn.xitu.io/2019/12/6/16ed8de09aa9238a?w=727&h=220&f=png&s=71083)
> 无论使用哪种类型的数组，数组的标识符[] ,它其实是一个引用，指在堆中创建了一个真实的对象(这个对象对我们程序员是不可见的)，我自己找了半天，我说他既然有length属性，那我肯定能在Java中找到这个对象，结果我硬是没找到，这个对象保存的是对其他对象的引用。length方法是唯一一个能用这个对象访问的属性或者方法

数组的特点
- 一致性：数组只能保存相同数据类型元素，元素的数据类型可以是任何相同的数据类型。
- 有序性：数组中的元素是有序的，通过下标访问。
- 不可变性：数组一旦初始化，则长度（数组中元素的个数）不可变。
数组是一种连续存储线性结构，元素类型相同，大小相等

数组的缺点：
- 事先必须知道数组的长度
- 插入删除元素很慢
- 空间通常是有限制的
- 需要大块连续的内存块
- 插入删除元素的效率很低



带你们来解密一下数组

![](https://user-gold-cdn.xitu.io/2019/12/5/16ed58718e6274a4?w=1541&h=561&f=png&s=96271)
一个[I 感觉像个非法字符，我们继续反射
 
![](https://user-gold-cdn.xitu.io/2019/12/5/16ed58cec7f14d3a?w=1717&h=863&f=png&s=204256)

我去，我发现 啥都没有，这么奇怪，那我为什么能访问它的length属性呢？


先不管为什么没有length成员变量，我们先搞清楚[I这个类是哪里声明的。既然[I都不是合法的标识符，那么这个类肯定不是在Java代码中显式声明的。想来想去，只能是JVM自己在运行时生成的了。JVM生成类还是一件很容易的事情，甚至无需生成字节码，直接在方法区中创建类型数据，就差不多完工了。

在The JavaTM Virtual Machine Specification Second Edition 5.3.3 Creating Array Classes。描述到： 类加载器先看看数组类是否已经被创建了。如果没有，那就说明需要创建数组类；如果有，那就无需创建了。如果数组元素是引用类型，那么类加载器首先去加载数组元素的类。JVM根据元素类型和维度，创建相应的数组类。

果然是JVM这家伙自个偷偷创建了[I类。JVM不把数组类放到任何包中，也不给他们起个合法的标识符名称，估计是为了避免和JDK、第三方及用户自定义的类发生冲突。其实想想，JVM也必须动态生成数组类，因为Java数组类的数量与元素类型、维度(最多255)有关，相当相当多了，是没法预先声明好的。



```
0 iconst_2                   //将int型常量2压入操作数栈  
1 newarray 10 (int)    //将2弹出操作数栈，作为长度，创建一个元素类型为int, 维度为1的数组，并将数组的引用压入操作数栈  
3 astore_1                 //将数组的引用从操作数栈中弹出，保存在索引为1的局部变量(即a)中  
4 aload_1                  //将索引为1的局部变量(即a)压入操作数栈  
5 arraylength            //从操作数栈弹出数组引用(即a)，并获取其长度(JVM负责实现如何获取)，并将长度压入操作数栈  
6 istore_2                 //将数组长度从操作数栈弹出，保存在索引为2的局部变量(即i)中  
7 return                    //main方法返回  
```
7 return                    //main方法返回  
可见，在这段字节码中，根本就没有看见length这个成员变量，获取数组长度是由一条特定的指令arraylength实现编译器对Array.length这样的语法做了特殊处理，直接编译成了arraylength指令。另外，JVM创建数组类，应该就是由newarray这条指令触发的了。

对数组操作有一个工类类Arrays，大家可以学习一下，源码定义常量的方式我们也可以学习一下，用位运算，还是不错的。

![](https://user-gold-cdn.xitu.io/2019/12/6/16ed8d1ad2e1febf?w=1625&h=628&f=png&s=161619)

然后，博主的能力不够了 什么字节码对象 反正大家了解那么多就行了。

## 链表

> 链表是离散存储线性结构

![](https://user-gold-cdn.xitu.io/2019/12/6/16ed8e630f957895?w=332&h=227&f=png&s=8701)

> n个节点离散分配，彼此通过指针相连，每个节点只有一个前驱节点，每个节点只有一个后续节点，首节点没有前驱节点，尾节点没有后续节点。

![](https://user-gold-cdn.xitu.io/2019/12/6/16ed8dfb4de711b2?w=669&h=425&f=png&s=120870)

链表优点：
- 空间没有限制
- 插入删除元素很快

链表缺点：
- 存取速度很慢

链表又分了好几类：
- 单向链表
    - 一个节点指向下一个节点

- 双向链表

    - 一个节点有两个指针域

- 循环链表

    - 能通过任何一个节点找到其他所有的节点，将两种(双向/单向)链表的最后一个结点指向第一个结点从而实现循环
    

    
## 用Java手撕链表

节点（Node）是由一个需要储存的对象及对下一个节点的引用组成的。也就是说，节点拥有两个成员：储存的对象、对下一个节点的引用。下面图是具体的说明：


![](https://user-gold-cdn.xitu.io/2019/12/6/16ed8e7cdd7f0f8b?w=725&h=223&f=png&s=16780)

让我们来实现一个简单的单向链表吧

### 先定义一个Node

![](https://user-gold-cdn.xitu.io/2019/12/6/16ed92480788bf0d?w=798&h=540&f=png&s=53490)
### 添加一个节点

![](https://user-gold-cdn.xitu.io/2019/12/6/16ed924db9ac9bb8?w=1102&h=573&f=png&s=91761)
### 遍历节点

![](https://user-gold-cdn.xitu.io/2019/12/6/16ed926b11b71cbe?w=1625&h=904&f=png&s=183785)

### 获取链表的长度


![](https://user-gold-cdn.xitu.io/2019/12/6/16ed92a361c3057a?w=1102&h=445&f=png&s=50433)

### 下面的代码实现的 增 删 改 查 基本上都有了 大家可以自己参考一下（自己比较菜，就写了几个简单的 很多东西需要算法的支持，就没写那么多来了）


```


/**
 * 
 */
public class MyLink {

    
    Node head = null; 

    /**
     * 
     */
    public class Node {
    
        public Object data;
        
        public Node next;

       
        public Node(Node next) {
            this.data = data;
            this.next = next;
        }

       
        public Node(Object data) {
            this.data = data;
        }
    }

  /**
     * 添加一个节点
     *
     * @param data
     */
    public void addNode(Object data) {
        Node addNode = new Node(data); //实例化一个节点
        //判断是不是第一个节点,如果是的话，我就把这个加入到头节点,因为是头节点所有就没有前驱节点了
        if (head == null) {
            head = addNode;
        } else {
            //如果不是第一个节点 得找到当前链表的最后一个节点 把要加入的节点的当做最后一个节点的后继节点
            Node temp = head; //定义一个临时节点 把头节点赋值给他 然后一直找，直到找到最后一个节点
            while (temp.next != null) {
                temp = temp.next;
            }
            //找到当前链表最后一个节点，然后把要加入的这个节点当做尾节点的后继
            temp.next = addNode;
        }
    }

    /**
     * 遍历链表
     */
    public void traverse() {
        if (null == head) {
            System.out.println("链表的长度为0");
        } else {

            /**
             * 说明不是只有一个元素
             */
            Node temp = head;
            while (temp != null) {
                System.out.println(temp.data);
                temp = temp.next;
            }
        }

    }


    /**
     * 获取链表的长度
     *
     * @return
     */
    public int length() {
        int length = 0;
        Node temp = head;
        while (temp != null) {
            length++;
            temp = temp.next;
        }
        return length;

    }

    // 首先需要判断指定位置是否正确
    public void insertNode(int index, int value) {
        if (index < 1 || index > length() + 1) {
            System.out.println("下标校验不通过。");
            return;
        }

        //临时节点，从头节点开始
        Node temp = head;

        //记录遍历的当前位置
        int currentPos = 0;


        //初始化要插入的节点
        Node insertNode = new Node(value);

        while (temp.next != null) {

            //找到上一个节点的位置了
            if ((index - 1) == currentPos) {

                //temp表示的是上一个节点

                //将原本由上一个节点的指向交由插入的节点来指向
                insertNode.next = temp.next;

                //将上一个节点的指针域指向要插入的节点
                temp.next = insertNode;

                return;

            }

            currentPos++;
            temp = temp.next;

        }


    }

    /**
     * 删除指定位置的节点
     *
     * @param index
     */
    public void delete(int index) {

        //首先需要判断指定位置是否正确，
        if (index < 1 || index > length() + 1) {
            System.out.println("下标校验不通过。");
            return;
        }

        //临时节点，从头节点开始
        Node temp = head;

        //记录遍历的当前位置
        int currentPos = 0;

        while (temp.next != null) {
            //先找到要删除节点 上一个节点的位置

            if (index - 1 == currentPos) {
                //temp 表示要删除的节点

                //temp.next表示的是想要删除的节点

                //将想要删除的节点存储一下
                Node deleteNode = temp.next;
                //把想要删除的下一个节点由上一个节点交互
                temp.next = deleteNode.next;


                return;

            }

            currentPos++;
            temp = temp.next;

        }


    }


    public Object getOne(int index){
        //首先需要判断指定位置是否正确，
        if (index < 1 || index > length()) {
            System.out.println("下标校验不通过");
            return null;
        }

        //临时节点
        Node temp = head;


        //记录遍历的当前位置
        int currentPos = 1;

        while (temp!=null){

            if (index==currentPos){
                return temp.data;
            }
            currentPos++;
            temp=temp.next;

        }

        return null;

    }
  

    public static void main(String[] args) {
        MyLink myLink = new MyLink();
        myLink.addNode("1");
        myLink.addNode("aaaa");
        myLink.traverse();
        System.out.println("-------------------------------------");
        myLink.delete(1);
        myLink.addNode("333");
        myLink.traverse();
        System.out.println("-------------------------------------");
        Object one = myLink.getOne(1);
        System.out.println(one);
    }


}

```




## 链表的一点总结

操作一个链表只需要知道它的头指针就可以做任何操作了

- 添加数据到链表中

    - 遍历找到尾节点，插入即可(只要while(temp.next != null)，退出循环就会找到尾节点)

- 遍历链表

    - 从首节点(有效节点)开始，只要不为null，就输出

- 给定位置插入节点到链表中

    - 将原本由上一个节点的指向交由插入的节点来指向

    - 上一个节点指针域指向想要插入的节点

    - 首先判断该位置是否有效(在链表长度的范围内)

    - 找到想要插入位置的上一个节点
- 获取链表的长度

    - 每访问一次节点，变量++操作即可
    
- 删除给定位置的节点

    - 将原本由上一个节点的指向后面一个节点

    - 首先判断该位置是否有效(在链表长度的范围内)

    - 找到想要插入位置的上一个节点
- 对链表进行排序

    - 使用冒泡算法对其进行排序
    
- 删除链表重复数据

    - 操作跟冒泡排序差不多，只要它相等，就能删除了～
    
还有很多就不一一列举，各位大佬要深入的自己深入吧，感觉脑子不够用，哈哈


## 结尾
>  数据结构的基础就讲那么多，也就是入门，后面还是靠自己，接下来我们要进入正题，讲我们的容器集合了。  
> 因为博主也是一个开发萌新 我也是一边学一边写 我有个目标就是一周 二到三篇 希望能坚持个一年吧 希望各位大佬多提意见，让我多学习，一起进步。
## 日常求赞
> 好了各位，以上就是这篇文章的全部内容了，能看到这里的人呀，都是**人才**。

> 创作不易，各位的支持和认可，就是我创作的最大动力，我们下篇文章见

>六脉神剑 | 文 【原创】如果本篇博客有任何错误，请批评指教，不胜感激 ！
