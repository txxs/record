### [1. 两数之和](https://leetcode-cn.com/problems/two-sum/)

> 给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那 两个 整数，并返回他们的数组下标。
>
> 你可以假设每种输入只会对应一个答案。但是，数组中同一个元素不能使用两遍。
>
> ```text
> 输入：nums = [2,7,11,15], target = 9
> 输出：[0,1]
> 解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。
> ```

**思路**：哈希表

```java
public static int[] twoSum(int[] nums,int target){
  Map<Integer,Integer> map = new HashMap<>();
  for (int i = 0; i < nums.length; i++) {
    int temp = target - nums[i];
    if(map.containsKey(temp)){
      return new int[]{map.get(temp),i};
    }
    map.put(nums[i],i);
  }
  return new int[]{-1,-1};
}
```



### [217. 存在重复元素](https://leetcode-cn.com/problems/contains-duplicate/)

> 给定一个整数数组，判断是否存在重复元素。如果存在一值在数组中出现至少两次，函数返回 `true` 。如果数组中每个元素都不相同，则返回 `false` 。
>
> ```
> 输入: [1,2,3,1]
> 输出: true
> ```
>
> ```
> 输入: [1,2,3,4]
> 输出: false
> ```

**思路**：哈希，和两数之和的思路一样

```java
public boolean containsDuplicate(int[] nums){
  Map<Integer,Integer> map = new HashMap<>();
  for(int i=0;i<nums.length;i++){
    if(map.containsKey(nums[i])){
      return true;
    }
    map.put(nums[i],i);
  }
  return false;
}
```



### [88. 合并两个有序数组](https://leetcode-cn.com/problems/merge-sorted-array/)

> 给你两个按 非递减顺序 排列的整数数组 nums1 和 nums2，另有两个整数 m 和 n ，分别表示 nums1 和 nums2 中的元素数目。
>
> 请你 合并 nums2 到 nums1 中，使合并后的数组同样按 非递减顺序 排列。
>
> 注意：最终，合并后数组不应由函数返回，而是存储在数组 nums1 中。为了应对这种情况，nums1 的初始长度为 m + n，其中前 m 个元素表示应合并的元素，后 n 个元素为 0 ，应忽略。nums2 的长度为 n 。
>
> ```
> 输入：nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
> 输出：[1,2,2,3,5,6]
> 解释：需要合并 [1,2,3] 和 [2,5,6] 。
> 合并结果是 [1,2,2,3,5,6] ，其中斜体加粗标注的为 nums1 中的元素。
> ```

**思路**：直接合并后排序、双指针

```java
public void merge(int[] nums1, int m, int[] nums2, int n) {
  for (int i = 0; i != n; ++i) {
    nums1[m + i] = nums2[i];
  }
  Arrays.sort(nums1);
}
```



### [121. 买卖股票的最佳时机](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock/)

> 给定一个数组 prices ，它的第 i 个元素 prices[i] 表示一支给定股票第 i 天的价格。
>
> 你只能选择 某一天 买入这只股票，并选择在 未来的某一个不同的日子 卖出该股票。设计一个算法来计算你所能获取的最大利润。
>
> 返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 0 。
>
> ```
> 输入：[7,1,5,3,6,4]
> 输出：5
> 解释：在第 2 天（股票价格 = 1）的时候买入，在第 5 天（股票价格 = 6）的时候卖出，最大利润 = 6-1 = 5 。
>      注意利润不能是 7-1 = 6, 因为卖出价格需要大于买入价格；同时，你不能在买入前卖出股票。
> ```

**思路**：暴力法，双循环

```java
public static int maxProfit_1(int[] nums){
  int maxProfit=0;
  //第一层不需要遍历到最后，第二层从i+1 开始就可以
  for(int i=0;i<nums.length-1;i++){
    for(int j=1;j<nums.length-1;j++){
      // 比较的是数据的值，不是下标，别写成maxProfit < j-i
      if(maxProfit < nums[j] - nums[i]){
        maxProfit = nums[j] - nums[i];
      }
    }
  }
  return maxProfit;
}
```



### [53. 最大子数组和](https://leetcode-cn.com/problems/maximum-subarray/)

> 给你一个整数数组 `nums` ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。
>
> **子数组** 是数组中的一个连续部分。
>
> ```
> 输入：nums = [-2,1,-3,4,-1,2,1,-5,4]
> 输出：6
> 解释：连续子数组 [4,-1,2,1] 的和最大，为 6 。
> ```

[动态规划、分治]



### [283. 移动零](https://leetcode-cn.com/problems/move-zeroes/)

> 给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。
>
> ```
> 输入: [0,1,0,3,12]
> 输出: [1,3,12,0,0]
> ```
>
> 1. 必须在原数组上操作，不能拷贝额外的数组。
> 2. 尽量减少操作次数。

![283_2.gif](https://pic.leetcode-cn.com/36d1ac5d689101cbf9947465e94753c626eab7fcb736ae2175f5d87ebc85fdf0-283_2.gif)

```java
public void moveZeroes(int[] nums){
  int j=0;
  //第一次遍历的时候，j指针记录非0的个数，只要是非0的统统都赋给nums[j]
  for(int i=0;i<nums.length;i++){
    if(nums[i] != 0){
      nums[j++] = nums[i];
    }
  }
  //非0元素统计完了，剩下的都是0了
  //所以第二次遍历把末尾的元素都赋为0即可
  for(int i = j;i<nums.length;i++){
    nums[i] = 0;
  }
}
```

![283_2.gif](https://pic.leetcode-cn.com/36d1ac5d689101cbf9947465e94753c626eab7fcb736ae2175f5d87ebc85fdf0-283_2.gif)

```java
public void moveZeroes_1(int[] nums){
    int j = 0;
    for (int i = 0; i < nums.length; i++) {
        //当前元素!=0，就把其交换到左边，等于0的交换到右边
        if(nums[i]!=0){
            int tmp = nums[i];
            nums[i] = nums[j];
            //每移动一次 j加1
            nums[j++] = tmp;
        }
    }
}
```



### [448. 找到所有数组中消失的数字](https://leetcode-cn.com/problems/find-all-numbers-disappeared-in-an-array/)

> 给你一个含 n 个整数的数组 nums ，其中 nums[i] 在区间 [1, n] 内。请你找出所有在 [1, n] 范围内但没有出现在 nums 中的数字，并以数组的形式返回结果。
>
> ```
> 输入：nums = [4,3,2,7,8,2,3,1]
> 输出：[5,6]
> ```
>
> ```
> 输入：nums = [1,1]
> 输出：[2]
> ```

```java
public static List<Integer> findNumbers(int[] nums){
  List<Integer> list = new ArrayList<>();
  int[] x = new int[nums.length + 1];
  //用一个新的数组，占位，数据长度大1，原数组元素放在对应的下边下，最后数组位是0的就是缺失元素
  for (int i = 0; i < nums.length; i++) {
    x[nums[i]]++;
  }
  for (int i = 1; i < x.length; i++) {
    if(x[i] == 0){
      list.add(i);
    }
  }
  return list;
}
```





### [11. 盛最多水的容器](https://leetcode-cn.com/problems/container-with-most-water/)

> 给你 n 个非负整数 a1，a2，...，an，每个数代表坐标中的一个点 (i, ai) 。在坐标内画 n 条垂直线，垂直线 i 的两个端点分别为 (i, ai) 和 (i, 0) 。找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。
>
> ![](https://aliyun-lc-upload.oss-cn-hangzhou.aliyuncs.com/aliyun-lc-upload/uploads/2018/07/25/question_11.jpg)
>
> ```
> 输入：[1,8,6,2,5,4,8,3,7]
> 输出：49 
> 解释：图中垂直线代表输入数组 [1,8,6,2,5,4,8,3,7]。在此情况下，容器能够容纳水（表示为蓝色部分）的最大值为 49。
> ```

**思路**：双指针

```java
public int maxArea(int[] height){
  int l = 0;
  int r = height.length - 1;
  int ans = 0;
  while( l < r){
    int area = Math.min(height[l], height[r]) * (r - l);
    ans = Math.max(ans,area);
    if(height[l] < height[r]){
      l ++;
    }else {
      r --;
    }
  }
  return ans;
}
```



### [15. 三数之和](https://leetcode-cn.com/problems/3sum/)

> 给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请你找出所有和为 0 且不重复的三元组。
>
> 注意：答案中不可以包含重复的三元组。
>
> ```java
> 输入：nums = [-1,0,1,2,-1,-4]
> 输出：[[-1,-1,2],[-1,0,1]]
> ```

**思路**：





### [215. 数组中的第K个最大元素](https://leetcode-cn.com/problems/kth-largest-element-in-an-array/)

> 给定整数数组 `nums` 和整数 `k`，请返回数组中第 `**k**` 个最大的元素。
>
> 请注意，你需要找的是数组排序后的第 `k` 个最大的元素，而不是第 `k` 个不同的元素。
>
> ```
> 输入: [3,2,1,5,6,4] 和 k = 2
> 输出: 5
> ```
>
> ```
> 输入: [3,2,3,1,2,4,5,5,6] 和 k = 4
> 输出: 4
> ```

**思路**：
