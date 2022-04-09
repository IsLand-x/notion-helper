// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const questions = [
        {
            question:"DatabaseID和Integration Token我为啥绑定不上啊？",
            answer:"请再次确认ID和Token。Token是以screct_开头的50长度的字符串，token是32长度的字符串。如果是已经存在的DB，请保证列名和类型的正确性（见下个问题），不过非常建议创建一个新的Database专门用于Notion助手。"
        },
        {
            question:"为什么提示表头错误？如何修复？",
            answer:"表头错误说明数据库的列名存在问题。当绑定数据库到Notion助手时，助手会自动帮你生成一些列，请不要删除或者重命名这些自动生成的列。 \
            可以通过手动创建对应的列修复，Name(类型为title)，Add Date(类型为date)，Date(类型为date)，Author(类型为text)，Href(类型为url)。列的顺序可以自定，但注意在后期使用时不要修改列名字。 \
            "
        },
        {
            question:"我可以给数据库添加一些列吗？可以调整列的顺序吗？",
            answer:"可以。除了删除或者重命名自动生成的列外，可以进行任意操作，例如更改列顺序，隐藏已有列，新增列等。"
        },
        {
            question:"我想解绑助手，应该如何操作？",
            answer:"暂时没有这个功能，但是您可以在Notion的My Integration页面删除对应的Integration Key或者将Integration移出您的数据库，这样Notion助手就不能访问对应的数据库了。"
        },
        {
            question:"为什么会提示\"文章过长\"？",
            answer:"这类提示多存在于有代码块的文章中，由于Notion限制在一次请求里一个block最多有100个children，对应到文章的代码块中就是100行代码，所以超出后就不能保存了。"
        },
        {
            question:"为什么提示\"无法解析的块或HTML标签\"？",
            answer:"这类问题不多。Notion助手通过Notion开放的API进行文章保存，通过Puppeteer爬取文章HTML标签。但是将HTML标签转换成Notion所需要的格式是完全手写的，所以也可能会存在一些边界情况。部分文章的图片没有扩展名时Notion无法识别（已通过助手走兜底逻辑修复），这类问题可以向开发者反馈来获得更高优先级的支持。"
        }
    ]
    return {
        errMsg:"ok",
        data:questions
    }
}