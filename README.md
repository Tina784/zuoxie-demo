# 马来西亚华文作家协会官网

静态官网源码，发布于 GitHub Pages。主要页面包括协会介绍、活动、课程报名、会员申请、文学奖资讯、出版品及种字网历史链接。

## CMS 与公开表单

课程报名、会员申请及 Facebook 自动同步由独立的私有 CMS 项目处理：`Tina784/zuoxie-cms`。

CMS 部署后，在以下页面的 `zuoxie-api-base` meta 标签填入后端 API 地址：

- `course-registration.html`
- `membership.html`
- `events.html`

例如：

```html
<meta name="zuoxie-api-base" content="https://cms.example.org/api">
```

不要把 Facebook Page Access Token、OpenAI API Key 或任何密码写进本项目。
