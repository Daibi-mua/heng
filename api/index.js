// // http 核心模块
// let http = require("http");
// // Axios
// let axios = require("axios");
// // URL 模块
// let parseURL = require("url");

// // 读取配置文件
// let config = null;
// fs.readFile("./config/lovexhj.json", (err, data) => {
//     config = JSON.parse(data.toString());
// })

// // 创建 WEB 服务器
// http.createServer(function (request, response) {
//     // 跨域
//     response.setHeader("Access-Control-Allow-Origin", "*");
//     response.setHeader("Access-Control-Allow-Headers", "Content-Type");
//     response.setHeader("content-type", "application/json");

//     // 获取请求地址
//     let url = request.url;

//     // 防止乱码
//     response.writeHead(200, {
//         'Content-Type': 'application/json; charset=utf-8'
//     });

//     // 获取记仇
//     if (url.includes("/get")) {
//         // 获取分页数据
//         let page = parseURL.parse(request.url, true);

//         // 数据验证
//         if (!page.query.page && !page.query.per_page) {
//             return res.json(back("少了点什么吧哥？", null));
//         }

//         axios.get(`https://gitee.com/api/v5/repos/${config.Gitee.owner}/${config.Gitee.repo}/issues?access_token=${config.Gitee.access_token}&state=open&sort=created&direction=desc&page=${page.query.page}&per_page=${page.query.per_page}`).then(res => {
//             if (res.status == 200) {
//                 return res.json(back(null, res.data));
//             }
//         }, err => {
//             return res.json(back(err, null));
//         });
//         return;
//     }

//     // 新增记仇
//     if (url === "/add") {
//         // post 参数获取
//         let result = "";
//         request.on("data", function (chunk) {
//             result += chunk;
//         });
//         request.on("end", function () {
//             try {
//                 result = JSON.parse(result);
//             } catch {
//                 return res.json(back("error", null));
//             }

//             // 密码验证
//             if (password != config.Gitee.password) {
//                 return res.json(back("爬", null));
//             }
//             // 数据验证
//             if (!title || !body) {
//                 return res.json(back("少了点什么吧哥？", null));
//             }
//             // 请求发送
//             axios.post(`https://gitee.com/api/v5/repos/${config.Gitee.owner}/issues`, {
//                 access_token: config.Gitee.access_token,
//                 owner: config.Gitee.owner,
//                 repo: config.Gitee.repo,
//                 title: title,
//                 body: body
//             }).then(res => {
//                 if (res.status == 201) {
//                     return res.json(back(null, "ok"));
//                 }
//             }, err => {
//                 return res.json(back(err, null));
//             });
//         });
//     } else {
//         return res.json(back("后端已成功跑起来了！", null));
//     }
// }).listen(3001, () => {
//     console.log("服务端已启动！访问地址：http://localhost:3001");
// });

// Express
var express = require("express");
// Axios
let axios = require("axios");
// file-system 文件系统
let fs = require("fs");

// 创建服务器
var app = express();

// 读取配置文件
let config = null;
fs.readFile("./config/lovexhj.json", (err, data) => {
    config = JSON.parse(data.toString());
});

// 返回类型
function back(err, data) {
    return {
        error: err,
        data: data
    };
}

// 跨域配置
app.all("*", (req, res, next) => {
    // google需要配置，否则报错cors error
    res.setHeader("Access-Control-Allow-Credentials", "true");
    // 允许的地址,http://127.0.0.1:9000这样的格式
    res.setHeader("Access-Control-Allow-Origin", req.get("Origin"));
    // 允许跨域请求的方法
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
    // 允许跨域请求header携带哪些东西
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, If-Modified-Since");
    next();
});

// 获取 post 参数
app.use(
    express.urlencoded({
        extended: false
    })
);
app.use(express.json());

/**
 * 获取小本本数据
 */
app.get("/", function (req, res) {
    res.send("小本本后端跑起来了！");
});

/**
 * 获取小本本数据
 */
app.get("/get", function (req, res) {
    let { page, per_page } = req.query;
    // 数据验证
    if (!page && !per_page) {
        return res.json(back("少了点什么吧哥？", null));
    }
    axios
        .get(
            `https://gitee.com/api/v5/repos/${config.Gitee.owner}/${config.Gitee.repo}/issues?access_token=${config.Gitee.access_token}&state=open&sort=created&direction=desc&page=${page}&per_page=${per_page}`
        )
        .then(
            (res1) => {
                if (res1.status == 200) {
                    return res.json(back(null, res1.data));
                }
            },
            (err) => {
                return res.json(back(err, null));
            }
        );
});

/**
 * 记仇
 */
app.post("/add", function (req, res) {
    let { title, body, password } = req.body;

    // 密码验证
    if (password != config.Gitee.password) {
        return res.json(back("爬", null));
    }
    // 数据验证
    if (!title || !body) {
        return res.json(back("少了点什么吧哥？", null));
    }
    // 请求发送
    axios
        .post(`https://gitee.com/api/v5/repos/${config.Gitee.owner}/issues`, {
            access_token: config.Gitee.access_token,
            owner: config.Gitee.owner,
            repo: config.Gitee.repo,
            title: title,
            body: body
        })
        .then(
            (res1) => {
                if (res1.status == 201) {
                    return res.json(back(null, "ok"));
                }
            },
            (err) => {
                return res.json(back(err, null));
            }
        );
});

app.listen(3000, function () {
    console.log("服务端已启动！访问地址：http://localhost:3000");
});
