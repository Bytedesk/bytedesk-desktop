<!--
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-08-20 22:01:32
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-08-21 07:20:48
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM – 
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license. 
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售 
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE 
 *  contact: 270580156@qq.com 
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved. 
-->
# 打包 FastAPI

- 用于windows环境中使用RPA操作客户端，打包成exe文件。
- 暂时跟mac/linux系统无关

```bash
# 设置国内镜像
# pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
# 设置代理
export http_proxy=http://127.0.0.1:10818
export https_proxy=http://127.0.0.1:10818
# 清理缓存
pip cache purge
# 
python -m venv .venv
#mac
source .venv/bin/activate
# deactivate
#windows
.venv\Scripts\activate
# 超时，设置镜像：
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
# 安装依赖
# mac
pip install -r requirements.txt
# windows
pip install -r requirements-win.txt
# 导出依赖
pip freeze > requirements.txt
# windows杀进程
cmd 命令打开窗口
# 注意要切换到此目录
cd c:\WINDOWS\system32\ 
netstat -ano | findstr 8200
taskkill /f /pid 进程号
```

```bash
# https://www.cnblogs.com/klchang/p/17737586.html
# https://juejin.cn/post/7167787660537233444
# 打包
pyinstaller main.py -n weiyuai --onefile --hidden-import=main --distpath=../dist-python
```

## electron调用

```bash
# https://www.cnblogs.com/SongLink/p/16472239.html
```
