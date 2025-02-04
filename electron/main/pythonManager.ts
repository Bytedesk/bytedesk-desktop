/*
 * @Author: jackning 270580156@qq.com
 * @Date: 2024-08-20 22:17:01
 * @LastEditors: jackning 270580156@qq.com
 * @LastEditTime: 2024-08-21 07:54:31
 * @Description: bytedesk.com https://github.com/Bytedesk/bytedesk
 *   Please be aware of the BSL license restrictions before installing Bytedesk IM –
 *  selling, reselling, or hosting Bytedesk IM as a service is a breach of the terms and automatically terminates your rights under the license.
 *  仅支持企业内部员工自用，严禁私自用于销售、二次销售或者部署SaaS方式销售
 *  Business Source License 1.1: https://github.com/Bytedesk/bytedesk/blob/main/LICENSE
 *  contact: 270580156@qq.com
 * 联系：270580156@qq.com
 * Copyright (c) 2024 by bytedesk.com, All Rights Reserved.
 */
import { spawn } from "child_process";
import { BrowserWindow } from "electron";
import path from "path";
import cmd from "node-cmd";

let pythonProcess: ReturnType<typeof spawn> | null = null;
export const startPythonServer = (mainWindow: BrowserWindow) => {
  if (process.platform !== "win32") {
    console.log("startPythonServer is not supported on non-Windows platforms.");
    return;
  }

  if (pythonProcess) {
    console.log("pythonProcess is not null");
    return;
  }
  console.log("startPythonServer");
  // 判断系统，选择不同的可执行文件路径
  let pythonPath = path.join(process.env.DIST_PYTHON, "weiyuai.exe");
  // if (process.platform === "darwin") {
  //   pythonPath = path.join(process.env.DIST_PYTHON, "weiyuai");
  // } else {
  //   pythonPath = path.join(process.env.DIST_PYTHON, "weiyuai.exe");
  // }
  console.log("pythonPath = " + pythonPath);
  // 使用spawn创建子进程
  pythonProcess = spawn(pythonPath, [], {
    windowsHide: true,
    shell: true,
    detached: false, // 设置detached为false，否则无法关闭子进程
  });

  // 监听子进程的输出
  pythonProcess.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  // 监听子进程的退出事件
  pythonProcess.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });

  pythonProcess.on("exit", (code, signal) => {
    console.log(`子进程退出，退出码: ${code}，信号: ${signal}`);
  });
};

export const stopPythonServer = () => {
  if (process.platform !== "win32") {
    console.log("stopPythonServer is not supported on non-Windows platforms.");
    return;
  }
  console.log("stopPythonServer", pythonProcess?.pid);
  cmd.run("c:\\WINDOWS\\system32\\taskkill /F /im weiyuai.exe");
  // kill(pythonProcess.pid);
  pythonProcess?.kill();
  pythonProcess = null;
};
