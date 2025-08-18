# clash

## rule

1. 包含了自己使用的分流规则

## js

1. 包含了自己使用的sub-store的脚本规则

## yaml

1. 包含了自己使用的yaml文件

# cms

1. 包含了自己整理的电视源 (非本人制作，从各大平台收集而来)

# LX-Source

1. 包含自己整理的落雪音乐源 (非本人制作，从各大平台收集而来)

# cherry-studio

1. 基于ubuntu-xfce的WebTop容器构建
2. 从[cherry-studio Linux 官网](https://www.cherry-ai.com/download) 获取到Linux的最新版本
3. 替换Dockerfile中的36行的 链接
4. 执行 docker build -t my-cherry-studio:latest . 进行构建
5. 端口依然是3000
6. cherry-studio的数据目录在/config/.config 目录下