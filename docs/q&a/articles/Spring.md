# Spring

------------

> 引用自：https://juejin.cn/post/6844903860658503693

1. 列举一些重要的Spring模块？

- Spring Core： 基础,可以说 Spring 其他所有的功能都需要依赖于该类库。主要提供 IOC 依赖注入功能。
- Spring  Aspects ： 该模块为与AspectJ的集成提供支持。
- Spring AOP ：提供了面向方面的编程实现。
- Spring JDBC : Java数据库连接。
- Spring JMS ：Java消息服务。
- Spring ORM : 用于支持Hibernate等ORM工具。
- Spring Web : 为创建Web应用程序提供支持。
- Spring Test : 提供了对 JUnit 和 TestNG 测试的支持。

2. IoC

IOC  = 工厂模式 + XML + 反射

IoC（Inverse of Control:控制反转）是一种设计思想，就是 将原本在程序中手动创建对象的控制权，交由Spring框架来管理。  IoC 在其他语言中也有应用，并非Spirng特有。IoC容器是Spring用来实现IoC的载体，IoC容器实际上就是个Map（key，value）,Map 中存放的是各种对象。将对象之间的相互依赖关系交给 IOC 容器来管理，并由 IOC 容器完成对象的注入。这样可以很大程度上简化应用的开发，把应用从复杂的依赖关系中解放出来。  IOC容器就像是一个工厂一样，当我们需要创建一个对象的时候，只需要配置好配置文件/注解即可，完全不用考虑对象是如何被创建出来的。 在实际项目中一个 Service 类可能有几百甚至上千个类作为它的底层，假如我们需要实例化这个 Service，你可能要每次都要搞清这个 Service 所有底层类的构造函数，这可能会把人逼疯。如果利用 IOC 的话，你只需要配置好，然后在需要的地方引用就行了，这大大增加了项目的可维护性且降低了开发难度。Spring 时代我们一般通过 XML 文件来配置 Bean，后来开发人员觉得 XML 文件来配置不太好，于是 SpringBoot 注解配置就慢慢开始流行起来。

3. AOP
   AOP(Aspect-Oriented Programming:面向切面编程)能够将那些与业务无关，却为业务模块所共同调用的逻辑或责任（例如事务处理、日志管理、权限控制等）封装起来，便于减少系统的重复代码，降低模块间的耦合度，并有利于未来的可拓展性和可维护性。Spring AOP就是基于动态代理的，如果要代理的对象，实现了某个接口，那么Spring AOP会使用JDK Proxy，去创建代理对象，而对于没有实现接口的对象，就无法使用 JDK Proxy 去进行代理了，这时候Spring AOP会使用Cglib ，这时候Spring AOP会使用 Cglib 生成一个被代理对象的子类来作为代理。

4. Spring AOP 和 AspectJ AOP 有什么区别？
   Spring AOP 属于运行时增强，而 AspectJ 是编译时增强。 Spring AOP 基于代理(Proxying)，而 AspectJ 基于字节码操作(Bytecode Manipulation)。
   Spring AOP 已经集成了 AspectJ  ，AspectJ  应该算的上是 Java 生态系统中最完整的 AOP 框架了。AspectJ  相比于 Spring AOP 功能更加强大，但是 Spring AOP 相对来说更简单

5. Spring AOP JDK和CGLIB动态代理的区别

- 原理区别：JDK：利用拦截器(拦截器必须实现InvocationHanlder)加上反射机制生成一个实现代理接口的匿名类，在调用具体方法前调用InvokeHandler来处理。JDK动态代理只能对实现了接口的类生成代理，而不能针对类；CGLIB动态代理：利用ASM开源包，对代理对象类的class文件加载进来，通过修改其字节码生成子类来处理。CGLIB是针对类实现代理，主要是对指定的类生成一个子类，覆盖其中的方法，并覆盖其中方法实现增强，但是因为采用的是继承，所以该类或方法最好不要声明成final，对于final类或方法，是无法继承的。
- 使用区别：如果目标对象实现了接口，默认情况下会采用JDK的动态代理实现AOP。如果目标对象实现了接口，可以强制使用CGLIB实现AOP。如果目标对象没有实现了接口，必须采用CGLIB库，Spring会自动在JDK动态代理和CGLIB之间转换。
- Spring中使用代理：当Bean实现接口时，Spring就会用JDK的动态代理。当Bean没有实现接口时，Spring会自动使用CGlib实现，但是前提是项目中导入了CGlib的相关依赖，否则Spring只能使用JDK来代理那些没有实现接口的类，这样生成的代理类会报错。
  可以强制使用CGlib（在spring配置中加入<aop:aspectj-autoproxy proxy-target-class="true"/>）。
- 代理效果：使用CGLib实现动态代理，CGLib底层采用ASM字节码生成框架，使用字节码技术生成代理类，在jdk6之前比使用Java反射效率要高。唯一需要注意的是，CGLib不能对声明为final的方法进行代理，因为CGLib原理是动态生成被代理类的子类。
  在jdk6、jdk7、jdk8逐步对JDK动态代理优化之后，在调用次数较少的情况下，JDK代理效率高于CGLIB代理效率，只有当进行大量调用的时候，jdk6和jdk7比CGLIB代理效率低一点，但是到jdk8的时候，jdk代理效率高于CGLIB代理，总之，每一次jdk版本升级，jdk代理效率都得到提升，而CGLIB代理消息确有点跟不上步伐。

6. Spring 中的 bean 的作用域有哪些?

- singleton : 唯一 bean 实例，Spring 中的 bean 默认都是单例的。
- prototype : 每次请求都会创建一个新的 bean 实例。
- request : 每一次HTTP请求都会产生一个新的bean，该bean仅在当前HTTP request内有效。
- session : 每一次HTTP请求都会产生一个新的 bean，该bean仅在当前 HTTP session 内有效。
- global-session： 全局session作用域，仅仅在基于portlet的web应用中才有意义，Spring5已经没有了。Portlet是能够生成语义代码(例如：HTML)片段的小型Java Web插件。它们基于portlet容器，可以像servlet一样处理HTTP请求。但是，与 servlet 不同，每个 portlet 都有不同的会话

7.1 Spring 中的单例 bean 的线程安全的吗？

不是，Spring框架中的单例bean不是线程安全的。spring 中的 bean 默认是单例模式，spring 框架并没有对单例 bean 进行多线程的封装处理。实际上大部分时候 spring bean 无状态的（比如 dao 类），所有某种程度上来说 bean 也是安全的，但如果 bean 有状态的话（比如 view model 对象），那就要开发者自己去保证线程安全了，最简单的就是改变 bean 的作用域，把“singleton”变更为“prototype”，这样请求 bean 相当于 new Bean() 了，所以就可以保证线程安全了。

- 有状态就是有数据存储功能。
- 无状态就是不会保存数据。

7.2 Spring如何处理线程并发问题？

在一般情况下，只有无状态的Bean才可以在多线程环境下共享，在Spring中，绝大部分Bean都可以声明为singleton作用域，因为Spring对一些Bean中非线程安全状态采用ThreadLocal进行处理，解决线程安全问题。ThreadLocal和线程同步机制都是为了解决多线程中相同变量的访问冲突问题。同步机制采用了“时间换空间”的方式，仅提供一份变量，不同的线程在访问前需要获取锁，没获得锁的线程则需要排队。而ThreadLocal采用了“空间换时间”的方式。

ThreadLocal会为每一个线程提供一个独立的变量副本，从而隔离了多个线程对数据的访问冲突。因为每一个线程都拥有自己的变量副本，从而也就没有必要对该变量进行同步了。ThreadLocal提供了线程安全的共享对象，在编写多线程代码时，可以把不安全的变量封装进ThreadLocal。解释Spring框架中bean的生命周期

在传统的Java应用中，bean的生命周期很简单。使用Java关键字new进行bean 实例化，然后该bean就可以使用了。一旦该bean不再被使用，则由Java自动进行垃圾回收。相比之下，Spring容器中的bean的生命周期就显得相对复杂多了。正确理解Springbean的生命周期非常重要，因为你或许要利用Spring提供的扩展点来自定义bean的创建过程。下图展示了bean装载到Spring应用上下文中的一个典型的生命周期过程。

> 引用自：https://www.cnblogs.com/javazhiyin/p/10905294.html

8. Spring 中的 bean 生命周期?

bean在Spring容器中从创建到销毁经历了若干阶段，每一阶段都可以针对 Spring如何管理bean进行个性化定制。

- Bean 容器找到配置文件中 Spring Bean 的定义。
- Bean 容器利用 Java Reflection API 创建一个Bean的实例。
- 如果涉及到一些属性值 利用 set()方法设置一些属性值。
- 如果 Bean 实现了 BeanNameAware 接口，调用 setBeanName()方法，传入Bean的名字。
- 如果 Bean 实现了 BeanClassLoaderAware 接口，调用 setBeanClassLoader()方法，传入 ClassLoader对象的实例。
- 如果Bean实现了 BeanFactoryAware 接口，调用 setBeanClassLoader()方法，传入 ClassLoade r对象的实例。
- 与上面的类似，如果实现了其他 *.Aware接口，就调用相应的方法。
- 如果有和加载这个 Bean 的 Spring 容器相关的 BeanPostProcessor 对象，执行postProcessBeforeInitialization() 方法
- 如果Bean实现了InitializingBean接口，执行afterPropertiesSet()方法。
- 如果 Bean 在配置文件中的定义包含  init-method 属性，执行指定的方法。
- 如果有和加载这个 Bean的 Spring 容器相关的 BeanPostProcessor 对象，执行postProcessAfterInitialization() 方法
- 当要销毁 Bean 的时候，如果 Bean 实现了 DisposableBean 接口，执行 destroy() 方法。
- 当要销毁 Bean 的时候，如果 Bean 在配置文件中的定义包含 destroy-method 属性，执行指定的方法。

不错的：https://www.jianshu.com/p/1dec08d290c1

概括起来就是：

- 实例化 Instantiation
- 属性赋值 Populate
- 初始化 Initialization
- 销毁 Destruction

另外一个稍微详细一些的：https://blog.csdn.net/qq_35246620/article/details/53509102

- 实例化 Bean：对于BeanFactory容器来说，当用户向容器请求一个尚未初始化的 Bean 或初始化 Bean的时候，如果需要注入另一个尚未初始化的依赖，容器就会调用createBean进行实例化；对于ApplicationContext容器来说，当容器启动结束后，便实例化所有的 Bean。容器通过获取BeanDefinition对象中的信息进行实例化。并且这一步仅仅是简单的实例化，并未进行依赖注入。 实例化对象被包装在BeanWrapper对象中，BeanWrapper提供了设置对象属性的接口，从而避免了使用反射机制设置属性。
- 设置对象属性（依赖注入）：实例化后的对象被封装在BeanWrapper对象中，并且此时对象仍然是一个原生的状态，并没有进行依赖注入。 紧接着，Spring 根据BeanDefinition中的信息进行依赖注入，并且通过BeanWrapper提供的设置属性的接口完成依赖注入。
- 注入 Aware 接口：紧接着，Spring 会检测该对象是否实现了xxxAware接口，并将相关的xxxAware实例注入给 Bean
- BeanPostProcessor：当经过上述几个步骤后，Bean 对象已经被正确构造，但如果你想要对象被使用前再进行一些自定义的处理，就可以通过BeanPostProcessor接口实现。 该接口提供了两个函数：postProcessBeforeInitialzation(Object bean, String beanName)当前正在初始化的 Bean 对象会被传递进来，我们就可以对这个 Bean 作任何处理。这个函数会先于InitialzationBean执行，因此称为前置处理。 所有Aware接口的注入就是在这一步完成的。postProcessAfterInitialzation(Object bean, String beanName)当前正在初始化的 Bean 对象会被传递进来，我们就可以对这个 Bean 作任何处理。这个函数会在InitialzationBean完成后执行，因此称为后置处理。
- InitializingBean与init-method：当BeanPostProcessor的前置处理完成后就会进入本阶段。InitializingBean接口只有一个函数：afterPropertiesSet()这一阶段也可以在Bean正式构造完成前增加我们自定义的逻辑，但它与前置处理不同，由于该函数并不会把当前 Bean 对象传进来，因此在这一步没办法处理对象本身，只能增加一些额外的逻辑。 若要使用它，我们需要让 Bean 实现该接口，并把要增加的逻辑写在该函数中。然后，Spring 会在前置处理完成后检测当前 Bean 是否实现了该接口，并执行afterPropertiesSet函数。当然，Spring为了降低对客户代码的侵入性，给Bean的配置提供了init-method属性，该属性指定了在这一阶段需要执行的函数名。Spring便会在初始化阶段执行我们设置的函数。init-method本质上仍然使用了InitializingBean接口。
- DisposableBean 和 destroy-method：如果 Bean 实现了DispostbleBean接口，Spring 将调用它的destory方法，作用与在配置文件中对 Bean 使用destory-method属性的作用一样，都是在 Bean 实例销毁前执行的方法。

9. 说说自己对于 Spring MVC 了解?

MVC 是一种设计模式,Spring MVC 是一款很优秀的 MVC 框架。Spring MVC 可以帮助我们进行更简洁的Web层的开发，并且它天生与 Spring 框架集成。Spring MVC 下我们一般把后端项目分为 Service层（处理业务）、Dao层（数据库操作）、Entity层（实体类）、Controller层(控制层，返回数据给前台页面)。

流程说明（重要）：

- 客户端（浏览器）发送请求，直接请求到 DispatcherServlet。
- DispatcherServlet 根据请求信息调用 HandlerMapping，解析请求对应的 Handler。
- 解析到对应的 Handler（也就是我们平常说的 Controller 控制器）后，开始由 HandlerAdapter 适配器处理。
- HandlerAdapter 会根据 Handler来调用真正的处理器开处理请求，并处理相应的业务逻辑。
- 处理器处理完业务后，会返回一个 ModelAndView 对象，Model 是返回的数据对象，View 是个逻辑上的 View。
- ViewResolver 会根据逻辑 View 查找实际的 View。
- DispaterServlet 把返回的 Model 传给 View（视图渲染）。
- 把 View 返回给请求者（浏览器）

10. Spring 框架中用到了哪些设计模式？

- 工厂设计模式 : Spring使用工厂模式通过 BeanFactory、ApplicationContext 创建 bean 对象。
- 代理设计模式 : Spring AOP 功能的实现。
- 单例设计模式 : Spring 中的 Bean 默认都是单例的。
- 模板方法模式 : Spring 中 jdbcTemplate、hibernateTemplate 等以 Template 结尾的对数据库操作的类，它们就使用到了模板模式。
- 包装器设计模式 : 我们的项目需要连接多个数据库，而且不同的客户在每次访问中根据需要会去访问不同的数据库。这种模式让我们可以根据客户的需求能够动态切换不同的数据源。
- 观察者模式: Spring 事件驱动模型就是观察者模式很经典的一个应用。
- 适配器模式 :Spring AOP 的增强或通知(Advice)使用到了适配器模式、spring MVC 中也是用到了适配器模式适配Controller。

11. @Component 和 @Bean 的区别是什么？

- 作用对象不同: @Component 注解作用于类，而@Bean注解作用于方法。
- @Component通常是通过类路径扫描来自动侦测以及自动装配到Spring容器中。@Bean 注解通常是我们在标有该注解的方法中定义产生这个 bean,@Bean告诉了Spring这是某个类的示例，当我需要用它的时候还给我。
- @Bean 注解比 Component 注解的自定义性更强，而且很多地方我们只能通过 @Bean 注解来注册bean。比如当我们引用第三方库中的类需要装配到 Spring容器时，则只能通过 @Bean来实现。

>引用自：https://www.zhihu.com/question/39356740

12. @Resource和@Autowired的区别

- @Autowired默认按byType自动装配，而@Resource默认byName自动装配。
- @Autowired只包含一个参数：required，表示是否开启自动准入，默认是true。而@Resource包含七个参数，其中最重要的两个参数是：name 和 type。
- @Autowired如果要使用byName，需要使用@Qualifier一起配合。而@Resource如果指定了name，则用byName自动装配，如果指定了type，则用byType自动装配。
- @Autowired能够用在：构造器、方法、参数、成员变量和注解上，而@Resource能用在：类、成员变量和方法上。
- @Autowired是spring定义的注解，而@Resource是JSR-250定义的注解。

13.1 将一个类声明为Spring的 bean 的注解有哪些?
我们一般使用 @Autowired 注解自动装配 bean，要想把类标识成可用于 @Autowired 注解自动装配的 bean 的类,采用以下注解可实现：

- @Component ：通用的注解，可标注任意类为 Spring 组件。如果一个Bean不知道属于拿个层，可以使用@Component 注解标注。
- @Repository : 对应持久层即 Dao 层，主要用于数据库相关操作。
- @Service : 对应服务层，主要涉及一些复杂的逻辑，需要用到 Dao层。
- @Controller : 对应 Spring MVC 控制层，主要用户接受用户请求并调用 Service 层返回数据给前端页面。

13.2 有哪些重要的注解

- @Component：用于指示类是组件。这些类用于自动注入，并在使用基于注解的配置时配置为bean。
- @Controller：是一种特定类型的组件，用于MVC应用程序，主要与@RequestMapping注解一起使用。
- @Repository：用于表示组件用作存储库和存储/检索/搜索数据的操作。我们可以将此注解应用于DAO实现类。
- @Service：用于指示类是服务层。

- @Required:此注解简单地说明作用的bean属性必须在配置时通过bean定义中的显式属性值或通过自动注入填充。如果作用的bean属性未填充，容器将抛出BeanInitializationException。
- @ResponseBody：用于将对象作为response，通常用于将XML或JSON数据作为response发送。
- @PathVariable:用于将动态值从URI映射到处理方法参数。
- @Autowired:对自动注入的位置和方式提供了更细粒度的控制。它可以用于在setter方法上自动注入bean。就像@Required 注解一样，修饰setter方法、构造器、属性或者具有任意名称和/或多个参数的PN方法。
- @Qualifier：当有多个相同类型的bean并且只需要将一个bean自动注入时，@Qualifier注解与@Autowired注释一起使用，通过指定将连接哪个bean来消除歧义。

- @Scope:配置Spring bean的作用域。
- @Configuration：表示Spring IOC容器可以将该类用作bean定义的源。
- @ComponentScan:应用此注解时，将扫描包下的所有可用类。
- @Bean：对于基于java的配置，用@Bean注解修饰的方法将返回一个在Spring应用程序上下文中注册为Bean的对象。

用于配置切面和通知、@Aspect、@Before、@After、@Around、@Pointcut等的AspectJ注解。

13.3 注解@Primary的重要性
当有多个相同数据类型的bean时，开发人员Spring的@Primary注解，它会自动为特定bean提供更高的优先级。这个注解可以用在任何直接或间接用@Component注解修饰的类上，也可以用在用@Bean注解修饰的方法上。

> 引用自：https://www.yinxiang.com/everhub/note/b61e4f19-27ed-4a09-841b-036c056b8843

13.4 @ControllerAdvice
有@ControllerAdvice注解的类可以显式声明为Spring bean，或者通过类路径扫描自动注入。所有这样的bean都是通过AnnotationAwareOrderComparator排序的，即基于@Order和Ordered，并在运行时按该顺序调用。对于处理异常，将使用匹配的异常处理程序方法在第一个通知上选择一个@ExceptionHandler。对于模型属性和InitBinder初始化，@ModelAttribute和@InitBinder方法也将遵循@ControllerAdvice顺序。

14. Spring 管理事务的方式有几种？

- 编程式事务，在代码中硬编码。(不推荐使用)
- 声明式事务，在配置文件中配置（推荐使用）

声明式事务又分为两种：

- 基于XML的声明式事务
- 基于注解的声明式事务

15. Spring 事务中的隔离级别有哪几种?

TransactionDefinition 接口中定义了五个表示隔离级别的常量：

- TransactionDefinition.ISOLATION_DEFAULT:  使用后端数据库默认的隔离级别，Mysql 默认采用的 REPEATABLE_READ隔离级别 Oracle 默认采用的 READ_COMMITTED隔离级别.
- TransactionDefinition.ISOLATION_READ_UNCOMMITTED:最低的隔离级别，允许读取尚未提交的数据变更，可能会导致脏读、幻读或不可重复读
- TransactionDefinition.ISOLATION_READ_COMMITTED:允许读取并发事务已经提交的数据，可以阻止脏读，但是幻读或不可重复读仍有可能发生
- TransactionDefinition.ISOLATION_REPEATABLE_READ:对同一字段的多次读取结果都是一致的，除非数据是被本身事务自己所修改，可以阻止脏读和不可重复读，但幻读仍有可能发生。
- TransactionDefinition.ISOLATION_SERIALIZABLE:最高的隔离级别，完全服从ACID的隔离级别。所有的事务依次逐个执行，这样事务之间就完全不可能产生干扰，也就是说，该级别可以防止脏读、不可重复读以及幻读。但是这将严重影响程序的性能。通常情况下也不会用到该级别。

16. Spring 事务中哪几种事务传播行为?

支持当前事务的情况：

- TransactionDefinition.PROPAGATION_REQUIRED： 如果当前存在事务，则加入该事务；如果当前没有事务，则创建一个新的事务。
- TransactionDefinition.PROPAGATION_SUPPORTS： 如果当前存在事务，则加入该事务；如果当前没有事务，则以非事务的方式继续运行。
- TransactionDefinition.PROPAGATION_MANDATORY： 如果当前存在事务，则加入该事务；如果当前没有事务，则抛出异常。（mandatory：强制性）

不支持当前事务的情况：

- TransactionDefinition.PROPAGATION_REQUIRES_NEW： 创建一个新的事务，如果当前存在事务，则把当前事务挂起。
- TransactionDefinition.PROPAGATION_NOT_SUPPORTED： 以非事务方式运行，如果当前存在事务，则把当前事务挂起。
- TransactionDefinition.PROPAGATION_NEVER： 以非事务方式运行，如果当前存在事务，则抛出异常。

其他情况：

- TransactionDefinition.PROPAGATION_NESTED： 如果当前存在事务，则创建一个事务作为当前事务的嵌套事务来运行；如果当前没有事务，则该取值等价于TransactionDefinition.PROPAGATION_REQUIRED。

17. BeanFactory和ApplicationContext有什么区别？

BeanFactory和ApplicationContext是Spring的两大核心接口，都可以当做Spring的容器。

- BeanFactory是Spring里面最底层的接口，是IoC的核心，定义了IoC的基本功能，包含了各种Bean的定义、加载、实例化，依赖注入和生命周期管理。ApplicationContext接口作为BeanFactory的子类，除了提供BeanFactory所具有的功能外，还提供了更完整的框架功能：

    - 继承MessageSource，因此支持国际化。
    - 资源文件访问，如URL和文件（ResourceLoader）。
    - 载入多个（有继承关系）上下文（即同时加载多个配置文件） ，使得每一个上下文都专注于一个特定的层次，比如应用的web层。
    - 提供在监听器中注册bean的事件。

- Bean 管理不同
    - BeanFactroy采用的是延迟加载形式来注入Bean的，只有在使用到某个Bean时(调用getBean())，才对该Bean进行加载实例化。这样，我们就不能提前发现一些存在的Spring的配置问题。如果Bean的某一个属性没有注入，BeanFacotry加载后，直至第一次使用调用getBean方法才会抛出异常。
    - ApplicationContext，它是在容器启动时，一次性创建了所有的Bean。这样，在容器启动时，我们就可以发现Spring中存在的配置错误，这样有利于检查所依赖属性是否注入。
    - ApplicationContext启动后预载入所有的单实例Bean，所以在运行的时候速度比较快，因为它们已经创建好了。相对于BeanFactory，ApplicationContext 唯一的不足是占用内存空间，当应用程序配置Bean较多时，程序启动较慢。

- BeanFactory和ApplicationContext都支持BeanPostProcessor、BeanFactoryPostProcessor的使用，但两者之间的区别是：BeanFactory需要手动注册，而ApplicationContext则是自动注册。
- BeanFactory通常以编程的方式被创建，ApplicationContext还能以声明的方式创建，如使用ContextLoader。

18. BeanFactory和ApplicationContext使用

```
Resource resource = new ClassPathResource("classpath.xml"); 
BeanFactory beanFactory = new XmlBeanFactory(resource);
```

ClassPathXmlApplicationContext：从classpath的xml配置文件创建，可以从jar包中读取配置文件。ClassPathXmlApplicationContext 编译路径总有三种方式：
```
ApplicationContext factory = new ClassPathXmlApplicationContext("classpath:applicationContext.xml");
ApplicationContext factory = new ClassPathXmlApplicationContext("applicationContext.xml"); 
ApplicationContext factory = new ClassPathXmlApplicationContext("file:E:/Workspaces/MyEclipse 8.5/Hello/src/applicationContext.xml");
```

> 引用自：https://www.jianshu.com/p/369a54201943

19. BeanPostProcessor使用

```
/**
 * 后置处理器：初始化前后进行处理工作
 * 将后置处理器加入到容器中
 */
@Component
public class MyBeanPostProcessor implements BeanPostProcessor {

    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        // TODO Auto-generated method stub
        System.out.println("postProcessBeforeInitialization..."+beanName+"=>"+bean);
        return bean;
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        // TODO Auto-generated method stub
        System.out.println("postProcessAfterInitialization..."+beanName+"=>"+bean);
        return bean;
    }

}
```

20. 如何创建一个如何给Spring 容器提供配置元数据？Spring有几种配置方式

- XML配置文件。
- 基于注解的配置。
- 基于java的配置。

21. 哪些是重要的bean生命周期方法？你能重载它们吗？

有两个重要的bean 生命周期方法，第一个是setup ， 它是在容器加载bean的时候被调用。第二个方法是 teardown 它是在容器卸载类的时候被调用。

bean 标签有两个重要的属性（init-method和destroy-method）。用它们你可以自己定制初始化和注销方法。它们也有相应的注解（@PostConstruct和@PreDestroy）。

22. 你可以在Spring中注入一个null 和一个空字符串吗？
    可以

23. 使用@Autowired注解自动装配的过程是怎样的？

使用@Autowired注解来自动装配指定的bean。在使用@Autowired注解之前需要在Spring配置文件进行配置，在启动springIoC时，容器自动装载了一个AutowiredAnnotationBeanPostProcessor后置处理器，当容器扫描到@Autowied、@Resource或@Inject时，就会在IoC容器自动查找需要的 bean，并装配给该对象的属性。在使用@Autowired时，首先在容器中查询对应类型的bean：

- 如果查询结果刚好为一个，就将该bean装配给@Autowired指定的数据；
- 如果查询的结果不止一个，那么@Autowired会根据名称来查找；
- 如果上述查找的结果为空，那么会抛出异常。解决方法时，使用required=false。

24. spring 自动装配 bean 有哪些方式？

在spring中，对象无需自己查找或创建与其关联的其他对象，由容器负责把需要相互协作的对象引用赋予各个对象，使用autowire来配置自动装载模式。在Spring框架xml配置中共有5种自动装配：

- no：默认的方式是不进行自动装配的，通过手工设置ref属性来进行装配bean。
- byName：通过bean的名称进行自动装配，如果一个bean的 property 与另一bean 的name 相同，就进行自动装配。
- byType：通过参数的数据类型进行自动装配。
- constructor：利用构造函数进行装配，并且构造函数的参数通过 byType进行装配。
- autodetect：自动探测，如果有构造方法，通过 construct的方式自动装配，否则使用 byType的方式自动装配。

25. 请解释一下Spring AOP核心的名称分别是什么意思？
- 切面（Aspect）：切面是通知和切点的结合。通知和切点共同定义了切面的全部内容。 在Spring AOP中，切面可以使用通用类（基于模式的风格） 或者在普通类中以 @AspectJ 注解来实现。
- 连接点（Join point）：指方法，在Spring AOP中，一个连接点总是代表一个方法的执行。应用可能有数以千计的时机应用通知。这些时机被称为连接点。连接点是在应用执行过程中能够插入切面的一个点。这个点可以是调用方法时、抛出异常时、甚至修改一个字段时。切面代码可以利用这些点插入到应用的正常流程之中，并添加新的行为。
- 通知（Advice）：在AOP术语中，切面的工作被称为通知。
- 切入点（Pointcut）：切点的定义会匹配通知所要织入的一个或多个连接点。我们通常使用明确的类和方法名称，或是利用正则表达式定义所匹配的类和方法名称来指定这些切点。
- 引入（Introduction）：引入允许我们向现有类添加新方法或属性。
- 目标对象（Target Object）：被一个或者多个切面（aspect）所通知（advise）的对象。它通常是一个代理对象。也有人把它叫做 被通知（adviced） 对象。 既然Spring AOP是通过运行时代理实现的，这个对象永远是一个 被代理（proxied） 对象。
- 织入（Weaving）：织入是把切面应用到目标对象并创建新的代理对象的过程。在目标对象的生命周期里有多少个点可以进行织入：

26. 在基于Spring框架的Web应用中，Spring的应用上下文配置文件applicationgContext.xml是如何自动加载的？

当运行一个Web项目时，应用服务器(JBoss、Tomcat等)首先会读取项目源码路径中的web.xml文件，解析其中的配置，发现配置了ContextLoaderListener，因此会执行ContextLoaderListener类中的contextInitialized方法，在这个方法中会调用initWebApplicationContext()方法，根据方法名可以看出这个方法是用于初始化一个WebApplicationContext，简单理解就是初始化一个Web应用下的Spring容器。在initWebApplicationContext()方法后续代码实现的内部会根据web.xml中配置的contextConfigLocation属性加载指定的applicationContext.xml文件，根据这个文件初始化Spring容器。

27. 有了解过web.xml中listener、filter和servlet的初始化顺序吗？

首先，对使用<listener>标签声明的监听器类进行实例化，调用监听器类实例对象的contextInitialized()方法，初始化应用上下文数据；接着对使用<filter>标签声明的过滤器类进行实例化，调用过滤器类实例对象的init()方法；如果<servlet>标签内使用了<load-on-startup>标签，则按照数值从小到大的顺序对Servlet进行实例化，并调用对应的init()方法。

28. 具体说一下DispatcherServlet请求分发的实现原理？

DispatcherServlet是一个Servlet，在应用启动时，DispatcherServlet初始化会执行init方法，查看源码发现DispatcherServlet的init方法继承自HttpServletBean，在这个初始化方法中会实例化一个WebApplicationContext对象，并且将初始化后的context存到ServletContext中，让Servlet和Spring容器进行关联。在DispatcherServlet的onRefresh方法中，初始化各种请求处理策略，例如文件上传处理策略、URL请求处理策略、视图映射处理策略、异常处理策略等，这些策略的大部分执行逻辑都是先从WebApplicationContext中查找，找不到的情况下再加载和DispatcherServlet同目录下的DispatcherServlet.properties中的各个策略，例如初始化HandlerMapping，注册各种请求的处理策略及处理类。

SpringMVC框架在启动的时候会遍历Spring容器中的所有bean，对标注了@Controller或@RequestMapping注解的类中方法进行遍历，将类和方法上的@RequestMapping注解值进行合并，使用@RequestMapping注解的相关参数值(如value、method等)封装一个RequestMappingInfo，将这个Controller实例、方法及方法参数信息(类型、注解等)封装到HandlerMethod中，然后以RequestMappingInfo为key，HandlerMethod为value存到一个以Map为结构的handlerMethods中。

接着，将@RequestMapping注解中的value(即请求路径)值取出，即url，然后以url为key，以RequestMappingInfo为value，存到一个以Map为结构的urlMap属性中。

客户端发起请求的时候，根据请求的URL到urlMap中查找，找到RequestMappingInfo，然后根据RequestMappingInfo到handlerMethods中查找，找到对应的HandlerMethod，接着将HandlerMethod封装到HandlerExecutionChain；接着遍历容器中所有HandlerAdapter实现类，找到支持这次请求的HandlerAdapter，如RequestMappingHandlerAdapter，然后执行SpringMVC拦截器的前置方法(preHandle方法)，然后对请求参数解析及转换，然后(使用反射)调用具体Controller的对应方法返回一个ModelAndView对象，执行拦截器的后置方法(postHandle方法)，然后对返回的结果进行处理，最后执行afterCompletion方法。

>引用自：https://mp.weixin.qq.com/s?__biz=MjM5NzgyODc1Mw==&mid=2647754263&idx=1&sn=2a06b7968718759b19d6eae35fbce988&chksm=bef127e98986aeff899a82d2525f2d62d7e05374597c7969a11afceb48f4f4005cd9d3e0abca&token=1650286378&lang=zh_CN#rd

29. Spring AOP and AspectJ AOP 有什么区别？AOP 有哪些实现方式？

SpringAOP属于运行时增强，而AspectJ是编译时增强。SpringAOP基于代理（Proxying），而AspectJ基于字节码操作（BytecodeManipulation）AOP实现的关键在于代理模式，AOP代理主要分为静态代理和动态代理。静态代理的代表为AspectJ；动态代理则以SpringAOP为代表。
- AspectJ是静态代理的增强，所谓静态代理，就是AOP框架会在编译阶段生成AOP代理类，因此也称为编译时增强，他会在编译阶段将AspectJ(切面)织入到Java字节码中，运行的时候就是增强之后的AOP对象。
- Spring AOP使用的动态代理，所谓的动态代理就是说AOP框架不会去修改字节码，而是每次运行时在内存中临时为方法生成一个AOP对象，这个AOP对象包含了目标对象的全部方法，并且在特定的切点做了增强处理，并回调原对象的方法。

Spring AOP中的动态代理主要有两种方式，JDK动态代理和CGLIB动态代理：

- JDK动态代理只提供接口的代理，不支持类的代理。核心InvocationHandler接口和Proxy类，InvocationHandler 通过invoke()方法反射来调用目标类中的代码，动态地将横切逻辑和业务编织在一起；接着，Proxy利用 InvocationHandler动态创建一个符合某一接口的的实例, 生成目标类的代理对象。
- 如果代理类没有实现 InvocationHandler 接口，那么Spring AOP会选择使用CGLIB来动态代理目标类。CGLIB（Code Generation Library），是一个代码生成的类库，可以在运行时动态的生成指定类的一个子类对象，并覆盖其中特定方法并添加增强代码，从而实现AOP。CGLIB是通过继承的方式做的动态代理，因此如果某个类被标记为final，那么它是无法使用CGLIB做动态代理的。

静态代理与动态代理区别在于生成AOP代理对象的时机不同，相对来说AspectJ的静态代理方式具有更好的性能，但是AspectJ需要特定的编译器进行处理，而Spring AOP则无需特定的编译器处理。

30. 为什么需要父子容器？

为什么需要父子容器？父子容器的主要作用应该是划分框架边界。有点单一职责的味道。在J2EE三层架构中，在service层我们一般使用spring框架来管理， 而在web层则有多种选择，如spring mvc、struts等。因此，通常对于web层我们会使用单独的配置文件。例如在上面的案例中，一开始我们使用spring-servlet.xml来配置web层，使用applicationContext.xml来配置service、dao层。如果现在我们想把web层从spring mvc替换成struts，那么只需要将spring-servlet.xml替换成Struts的配置文件struts.xml即可，而applicationContext.xml不需要改变。

31. SpringCloud的几个组件

- Eureka：各个服务启动时，Eureka Client都会将服务注册到Eureka Server，并且Eureka Client还可以反过来从Eureka Server拉取注册表，从而知道其他服务在哪里
- Ribbon：服务间发起请求的时候，基于Ribbon做负载均衡，从一个服务的多台机器中选择一台
- Feign：基于Feign的动态代理机制，根据注解和选择的机器，拼接请求URL地址，发起请求
- Hystrix：发起请求是通过Hystrix的线程池来走的，不同的服务走不同的线程池，实现了不同服务调用的隔离，避免了服务雪崩的问题
- Zuul：如果前端、移动端要调用后端系统，统一从Zuul网关进入，由Zuul网关转发请求给对应的服务

32. spring默认提供了五种通知

- 前置通知：该通知在方法执行之前执行，只需在公共方法上加@Before注解，就能定义前置通知
- 后置通知：该通知在方法执行之后执行，只需在公共方法上加@After注解，就能定义后置通知
- 环绕通知：该通知在方法执行前后执行，只需在公共方法上加@Round注解，就能定义环绕通知
- 结果通知：该通知在方法结束后执行，能够获取方法返回结果，只需在公共方法上加@AfterReturning注解，就能定义结果通知
- 异常通知：该通知在方法抛出异常之后执行，只需在公共方法上加@AfterThrowing注解，就能定义异常通知：

33. 生成代理对象产生的循环依赖

- 使用@Lazy注解，延迟加载
- 使用@DependsOn注解，指定加载先后关系
- 修改文件名称，改变循环依赖类的加载顺序

34. Spring的扩展点

https://segmentfault.com/a/1190000023033670

