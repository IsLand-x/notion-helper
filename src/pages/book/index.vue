<script lang="ts" setup>
import Header from '../../components/Header/index.vue';
import Card from '../../components/Card/index.vue'
import Heading1 from './components/Heading1/index.vue'
import Paragraph from './components/Paragraph/index.vue'
import UnorderedList from './components/UnorderedList/index.vue';
import ListItem from './components/ListItem/index.vue';
import Link from './components/Link/index.vue';
import { navigateToMiniProgram } from '@tarojs/taro';
import ScrollableContent from '../../components/ScrollableContent.vue';
import HomepageTooltip from '../../components/HomepageTooltip/index.vue'

const navigateToVideo = () => {
  const timestamp = new Date().getTime()
  const aid = '683611185'
  const path = `pages/video/video?__preload_=${timestamp * 10 + 3}&__key_=${timestamp * 10 + 4}&avid=${aid}`
  navigateToMiniProgram({
    appId: 'wx7564fd5313d24844',
    path
  })
}
</script>

<template>
  <Header :canGoBack="true">使用教程</Header>
  <ScrollableContent>
    <Card @click="navigateToVideo">
      <div class="text-lg text-red font-bold">点击跳转到Bilibili视频教程</div>
      <div class="text-sm">感谢用户 @阿江要努力鸭 提供的视频教程</div>
    </Card>
    <HomepageTooltip />
    <Card>
      <Heading1>背景</Heading1>
      <Paragraph>
        起初是想把公众号里的高质量文章统一收藏到Notion知识库。但是从手机上把文章收集到Notion实在是一件繁琐的事情——通常需要你分享文章到电脑，通过浏览器打开链接之后复制、粘贴到Notion中。
      </Paragraph>
      <Paragraph>好在，Notion最近开放了自己的API，微信小程序也在不久前增加了”聊天素材支持小程序打开”的能力，这样就不难实现将文章分享到小程序，然后自动保存到Notion的功能。</Paragraph>
      <Heading1>Step1 创建Integration</Heading1>
      <UnorderedList>
        <ListItem>
          打开
          <Link href="https://www.notion.com/my-integrations">Integration 配置页</Link>
        </ListItem>
        <ListItem>点击 &quot;+ New integration&quot; 按钮</ListItem>
        <ListItem>
          给你的Integration命名 - 在这里以 &quot;Vacation Planner&quot;
          为例（官网上的例子是这个，不过建议大家在此填写”Notion助手&quot;方便标识用途）
        </ListItem>
        <ListItem>选择这个Integration能够访问的workspace</ListItem>
        <ListItem>选择Integration的权限</ListItem>
        <ListItem>点击 &quot;Submit&quot; 来创建Integration</ListItem>
        <ListItem>复制 &quot;Internal Integration Token&quot; 并暂存下来，后面会用到。</ListItem>
      </UnorderedList>
      <div class="flex items-center justify-center">
        <img mode="aspectFit"
          src="cloud://cloud1-0gdb05jw5581957d.636c-cloud1-0gdb05jw5581957d-1310720469/2ec137d-093ad49-create-integration.gif" />
      </div>
      <Heading1>Step2 将Database分享给Integration</Heading1>
      <Paragraph>
        Integration起初是没有workspace中任何一个page或者database的权限的。你必须将某个page或者database分享给Integration才能让它访问。这有利于Notion中的信息安全。
      </Paragraph>
      <Paragraph>方便起见，我们这里创建一个database。然后将它分享给Integration。</Paragraph>
      <div class="flex items-center justify-center">
        <img mode="aspectFit" style="height:400rpx"
          src="cloud://cloud1-0gdb05jw5581957d.636c-cloud1-0gdb05jw5581957d-1310720469/0a267dd-share-database-with-integration.gif" />
      </div>
      <Paragraph>现在，你的Integration就有了访问这个database的权限。在进行下一步之前，你需要获得这个database 的链接。</Paragraph>
      <Paragraph>
        如果你的database是Full page Database，可以点击页面上方的Share按钮，然后选择
        CopyLink。
      </Paragraph>
      <div class="flex items-center justify-center">
        <img mode="aspectFit" style="height:300rpx"
          src="cloud://cloud1-0gdb05jw5581957d.636c-cloud1-0gdb05jw5581957d-1310720469/QQ截图20220409231534.png" />
      </div>
      <Paragraph>
        如果你的database是Inline Database，可以通过旁边的抓手选择CopyLink
      </Paragraph>
      <div class="flex items-center justify-center">
        <img mode="aspectFit" style="height:350rpx"
          src="cloud://cloud1-0gdb05jw5581957d.636c-cloud1-0gdb05jw5581957d-1310720469/QQ截图20220409230628.png" />
      </div>
      <Paragraph>DatabaseID是URL中在workspace后的，并且在问号 ? 之前的一部分，这个ID共有32位字符。这里需要记录这个Database ID。</Paragraph>
      <div class="flex items-center justify-center">
        <img style="height: 100rpx;" mode="aspectFit"
          src="cloud://cloud1-0gdb05jw5581957d.636c-cloud1-0gdb05jw5581957d-1310720469/QQ截图20220403111521.png" />
      </div>
      <Heading1>Step3 绑定到Notion助手</Heading1>
      <Paragraph>
        打开 “Notion助手” 微信小程序，点击用户绑定。将Step1的
        Internal Integration Token 和 Database ID粘贴上去，点击绑定即可。
      </Paragraph>
      <div class="flex justify-center items-center">
        <img mode="aspectFit"
          src="cloud://cloud1-0gdb05jw5581957d.636c-cloud1-0gdb05jw5581957d-1310720469/Screenshot_2022-04-02-23-35-47-467_com.tencent.mm.jpg" />
        <img mode="aspectFit"
          src="cloud://cloud1-0gdb05jw5581957d.636c-cloud1-0gdb05jw5581957d-1310720469/Screenshot_2022-04-02-23-35-52-977_com.tencent.mm.jpg" />
      </div>
      <Heading1>Step4 将公众号的文章保存到Notion</Heading1>
      <Paragraph>可以直接通过首页的”文章保存“功能保存文章。</Paragraph>
      <Paragraph>如果你是Android用户，可以通过在公众号文章页面，点击右上角三个点，选择更多打开方式，选择Notion助手快捷保存。</Paragraph>
      <div class="flex justify-center items-center">
        <img mode="aspectFit"
          src="cloud://cloud1-0gdb05jw5581957d.636c-cloud1-0gdb05jw5581957d-1310720469/qq_pic_merged_1648914127436.jpg" />

        <img mode="aspectFit"
          src="cloud://cloud1-0gdb05jw5581957d.636c-cloud1-0gdb05jw5581957d-1310720469/Screenshot_2022-04-02-23-41-02-344_com.tencent.mm.jpg" />

        <img mode="aspectFit"
          src="cloud://cloud1-0gdb05jw5581957d.636c-cloud1-0gdb05jw5581957d-1310720469/Screenshot_2022-04-02-23-41-10-770_com.tencent.mm.jpg" />
      </div>
      <Paragraph>
        如果你是ios用户，需要注意，因为微信ios端并没有开放“保存聊天素材到小程序”API，所以暂时无法实现上述快捷保存功能。建议暂时将文章链接复制到“备忘录”等第三方应用，通过“批量保存”功能一次性保存所有文章，提升阅读体验和收藏效率。
      </Paragraph>
      <Paragraph>
        ios用户可以使用Notion助手提供的捷径剪藏内容，使用教程以及捷径链接详见Notion助手主页。
      </Paragraph>
      <Paragraph>
        此外，Notion助手提供了浏览器插件，使用教程以及插件下载链接详见Notion助手主页。
      </Paragraph>
      <Heading1>完成</Heading1>
      <Paragraph>可以看到，文章链接和内容都被收藏到Notion中了 🖖🖖🖖</Paragraph>
      <div class="flex justify-center items-center">
        <img mode="aspectFit"
          src="cloud://cloud1-0gdb05jw5581957d.636c-cloud1-0gdb05jw5581957d-1310720469/QQ截图20220404223922.png"
          style="height:200rpx" />
      </div>
      <div class="flex justify-center items-center">
        <img mode="aspectFit"
          src="cloud://cloud1-0gdb05jw5581957d.636c-cloud1-0gdb05jw5581957d-1310720469/QQ截图20220404223859.png" />
      </div>
      <Heading1>后记</Heading1>
      <Paragraph>后面会想一些更多有意思的使用方法~</Paragraph>
    </Card>
  </ScrollableContent>
</template>
