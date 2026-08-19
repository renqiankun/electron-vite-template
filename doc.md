# Electron 跨系统、CPU 架构与打包说明

本文说明本项目在 Windows、Linux 与 macOS 下打包时，操作系统、CPU 架构、包格式、原生模块和下载镜像带来的影响。

## 1. 先区分操作系统、发行版、CPU 架构

它们是三个不同的概念，打包时必须同时匹配。

| 维度 | 示例 | 对打包的影响 |
| --- | --- | --- |
| 操作系统 | Windows、Linux、macOS | 决定 Electron 的目标平台与安装包格式 |
| Linux 发行版 | UOS、银河麒麟、Ubuntu、Debian、RHEL、Anolis | 决定优先使用 `.deb` 还是 `.rpm` |
| CPU 架构 | `x64`、`arm64`、`loongarch64` | 决定 Electron 二进制和原生模块的二进制格式 |

不能把 `x64` 包安装到 `arm64` 或 `loongarch64` 系统上；同样，不能把 `arm64` 包安装到 `x64` 系统上。

常见国产平台的对应关系如下：

| 常见 CPU | 通常对应的 Linux 架构 | 本项目的处理方式 |
| --- | --- | --- |
| 海光、兆芯、Intel、AMD | `x64`（Debian 中也常显示为 `amd64`） | 使用 x64 包 |
| 鲲鹏、飞腾 | `arm64` | 使用 ARM64 包 |
| 龙芯 | `loongarch64` | 需单独评估 Electron 运行时；不能直接使用本项目的 x64/ARM64 包 |

在目标 Linux 机器执行以下命令可确认架构：

```bash
uname -m
dpkg --print-architecture   # Debian/UOS/Ubuntu 系可用
```

常见结果：`x86_64` / `amd64` 对应 x64，`aarch64` / `arm64` 对应 ARM64，`loongarch64` 对应龙芯架构。

## 2. Linux 包格式：AppImage、DEB、RPM

| 格式 | 适用系统 | 特点 | 推荐用途 |
| --- | --- | --- | --- |
| `.AppImage` | 大多数桌面 Linux | 单文件、免安装、可移动；系统集成和升级能力较弱 | 试用、无管理员权限、兼容性备用包 |
| `.deb` | Debian、Ubuntu、UOS 和 Debian 系麒麟等 | 由 APT/软件包安装器管理，可卸载、菜单集成良好 | 国产桌面系统的正式首选包 |
| `.rpm` | RHEL、CentOS、Rocky、Anolis 和 RPM 系麒麟等 | 由 DNF/YUM/软件安装器管理 | 面向 RPM 系客户的正式包 |

`.deb` 和 `.rpm` 不能互相安装。若客户系统未知，建议同时提供三种格式；若已经确定发行版，应只发布对应格式，减少测试与维护成本。

## 3. 本项目当前打包配置

`electron-builder.json5` 当前的 Linux 配置会声明以下 6 个目标：

| 格式 | x64 | arm64 |
| --- | ---: | ---: |
| AppImage | 是 | 是 |
| deb | 是 | 是 |
| rpm | 是 | 是 |

包文件名中含有 `${arch}`，例如：

```text
jiangxi-diaodu_0.0.2_x64.deb
jiangxi-diaodu_0.0.2_arm64.rpm
```

后续确定实际客户环境后，可以在 `electron-builder.json5` 中删除不需要的 `target` 块，或从每个 `arch` 数组中删除 `x64` / `arm64`。

当前 Windows 目标是 x64 NSIS 安装包；macOS 目标是 x64 DMG。macOS 打包前还需要准备 `assets/icon/icon.icns` 图标文件。

## 4. 应在什么环境打包

### Windows 包

在 Windows 中执行即可：

```powershell
npm ci
npm run build
```

### Linux x64 包

推荐在 x64 Linux、WSL2 的 Ubuntu，或 Linux Docker 容器中构建。Linux 的 AppImage 应在 Linux 环境或 Linux Docker 中构建，不应依赖 Windows 直接交叉构建。

在 Linux/WSL2 中可以执行：

```bash
npm ci
npm run build -- --linux --x64
```

### Linux ARM64 包

推荐优先级如下：

1. ARM64 实机或 ARM64 云主机（最可靠，适合鲲鹏、飞腾客户）。
2. x64 Linux Docker + QEMU 模拟 ARM64。
3. CI 平台提供的 ARM64 构建机。

Docker/QEMU 的典型流程如下。首次需要为 Docker 安装 ARM64 模拟支持：

```bash
docker run --privileged --rm tonistiigi/binfmt --install arm64
```

然后在 ARM64 Linux 容器中安装依赖并打包：

```bash
docker run --rm -it \
  -v "$PWD:/project" \
  -w /project \
  --platform linux/arm64 \
  electronuserland/builder:20 \
  /bin/bash -lc "npm ci && npm run build -- --linux --arm64"
```

Windows 上使用 Docker Desktop 时，也可以通过 PowerShell 的目录挂载方式执行同类命令。构建输出会写回项目的 `release` 目录。

### 国产操作系统 VMware 测试

若客户是 x64 UOS/麒麟，建议在 VMware 中安装尽可能相同版本的目标系统：

1. 在虚拟机内重新执行 `npm ci` 和打包命令。
2. 安装生成的 `.deb` 或 `.rpm`。
3. 验证启动、菜单、文件访问、打印、升级与卸载。

VMware 中的系统通常和宿主机同架构。因此 x64 Windows 主机适合验证 x64 UOS/麒麟，不等同于 ARM64 鲲鹏/飞腾的真实环境。

## 5. 原生模块的影响

本项目实际依赖 `better-sqlite3`。它不是纯 JavaScript 包，包含原生二进制模块；其产物必须同时匹配：

- 目标操作系统：例如 Linux。
- CPU 架构：x64 或 arm64。
- Electron 版本对应的 Node ABI。

因此，**不能复制 Windows 或 x64 的 `node_modules` 到 Linux ARM64 后直接打包或运行**。应在干净的项目副本或已移除旧依赖目录的目标环境内重新执行：

```bash
npm ci
npx electron-builder install-app-deps
```

Electron Builder 默认会尝试重建原生依赖；在跨架构构建、下载不到预编译产物或构建失败时，仍需在目标架构的 Linux 环境准备编译工具链（通常包括 `python3`、`make`、`g++` 等）并重新构建。

如果应用仅加载 HTML、CSS 和 JavaScript，且没有原生模块，跨架构打包更简单；但 `.deb`、`.rpm`、`.AppImage` 的最终封装仍推荐在 Linux/Docker 环境完成。

## 6. Electron 与 npm 下载镜像

本项目已有两类镜像配置：

| 下载内容 | 配置位置 | 当前值 |
| --- | --- | --- |
| npm 依赖包 | `.npmrc` | `https://registry.npmmirror.com/` |
| Electron 运行时 | `electron-builder.json5` 的 `electronDownload.mirror` | `https://npmmirror.com/mirrors/electron/` |

打包时 Electron Builder 会根据目标平台和架构下载相应 Electron 二进制，例如 Linux x64 与 Linux arm64 需要不同的运行时文件。镜像必须同时提供所需的 `Electron 版本 + 平台 + 架构`，否则打包会失败。

建议：

1. Windows、Linux、Docker/CI 均使用一致、可访问的 npm 与 Electron 镜像。
2. 内网环境可设置企业内部 npm/Electron 镜像或预热 Docker/CI 缓存。
3. 切换 Electron 版本或新增 ARM64 架构后，先验证镜像能下载对应文件。
4. 遇到下载、校验或架构错误时，先清理该构建环境的 Electron 缓存后重试，不要复制其他系统的 `node_modules`。

## 7. 推荐发布流程

1. 向客户确认发行版（UOS/麒麟版本、Debian 系或 RPM 系）和 CPU 架构。
2. 在对应架构的 Linux 或 Docker/QEMU 环境执行 `npm ci`。
3. 只构建客户需要的目标，例如：

   ```bash
   npm run build -- --linux deb --x64
   npm run build -- --linux deb --arm64
   npm run build -- --linux rpm --x64
   ```

4. 在与客户环境相同的虚拟机或实机中安装、启动和卸载测试。
5. 将验证通过的包按“系统发行版 + CPU 架构”清晰命名后发布。

## 8. 参考资料

- [Electron Builder：Linux 目标说明](https://www.electron.build/docs/linux/)
- [Electron Builder：多平台构建](https://www.electron.build/docs/features/multi-platform-build/)
- [Electron Builder：架构与多架构构建](https://www.electron.build/docs/architecture/)
- [Electron Builder：AppImage 构建要求](https://www.electron.build/appimage/)
- [Electron：安装与平台/架构](https://www.electronjs.org/docs/latest/tutorial/installation)
