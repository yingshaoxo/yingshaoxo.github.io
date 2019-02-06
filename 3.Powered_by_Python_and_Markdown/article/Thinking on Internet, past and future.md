#### Internet is a great idea since 1960. The real meaning of the Internet: an international network. 

People don't understand, if they can get net access, they say they are on the Internet, that was wrong. Only you are on the Internet if you can access the whole world.
___

#### 网络是一个伟大的概念自从1960年它诞生。`Internet`的真正含义是：全球互联网。

人们常常犯错误，他们以为他们能上网就意味着他们正在使用全球网络。
___

#### Just like all communicational devices, they have been created for communications. And the initial need for communication is information exchange. Internet was designed to exchange information.

所有的通讯设备都是为了交流而被制造，交流的本质作用是信息交换。所以 `Internet` 是为了信息交换而被制造。
___

#### If we talk about information exchange, we must think about `sender`, `tunnel` and `receiver`. Those are the basic elements in communications.

讲到信息交换，我们不得不提到3个基本元素：`发送者`，`渠道` 和 `接收者`
___

#### So we will talk about the 3 elements one by one

所以我们将一一地讲解关于这三个部分的历史与发展
___

# 1. Sender (发送端)

#### There isn't much to say but from the telegram, huge computer to a smaller device such as a laptop, mobile phone. You can see their size becoming smaller and smaller. That's a trend.

这里没什么好说的，除了从电报机、巨型计算机到更小的设备，比如笔记本电脑、移动电话。你可以看到这些设备的规模越来越小。那是一种趋势，同时也显示了，信息传输的接口将变得越来越小、越来越灵活。

___

# 2. Tunnel (通道)

#### `Tunnel` is a abstract conception. It can be anything which could send differential data. Like `electrons` `in a wire` or `in free space`.

通道是一个抽象的概念。它可以是任何可以发送`有差异事物`的东西。比如`不等量电子` `在电线的移动`(光电传输)或`在自由空间的移动`(无线传输)。

#### There only 3 points are pushing its development: Stable, Cheap and Faster.

这里只有三个因素在驱动其发展：稳定，廉价，快速。

___

# 3. Receiver (接收者)

#### A receiver can also be a sender, so what senders have, receiver want it too: a smaller device.

一个接收者同时也可以是一个发送者，所以发送者需要的特性接收者也需要：一个更小的通讯设备。

#### Meanwhile, as a user, I mean, receiver, they are normal people. So if the device could make more convenient for them, that'll be appreciated. That is to say, easy to use, and remote communications as in person.

同时，作为一个用户，我指接收者，他们是普通人。所以如果有一个更好的办法或设备可以让他们的生活变得更简单，他们会感激的。也就是说，他们会喜欢`更容易使用的设备`和`让远端通讯像是面对面一样的工具`。

___

#### 在结尾，我想对上文中提到的东西在现实中的事物做一个对照

谷歌智能手表：用到了 蓝牙、WiFi、4G通讯等东西，并且接入端确实很小

底层硬件：光电并用，线里空中，以速度、成本、稳定性为导向

上层协议：TCP负责让上游开发者可以自定义更多的协议以实现对data的传输操作(http、email、socket、websocket等)，灵活性强

DNS: 网页还是需要它来解析域名，但现在实体app基本直接对ip地址进行 GET、POST 操作

直播或抖音：让远方的小姐姐像是出现在你身边一样

Tensorflowjs: 有了这玩意儿，小型服务提供商可以省去一大部分钱去训练AI模型，利用每一个客户机作分布式计算(前提是它得有浏览器。不用浏览器的也有啊，反正只要有网、有正规计算机配置，它们(指程序员)就能玩儿出花儿来)

Docker(or Kubernetes): 虚拟容器这东西真是火热，一次配置，一键使用，配置软路由也变得极其简单。基本告别手动配置 ip tables
