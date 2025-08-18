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
2. 从[cherry-studio Linux 官网](https://www.cherry-ai.com/download) 获取到Linux的最新版本，放到Dockerfile同级目录下，并且重命名为`Cherry-Studio-x86_64.AppImage`
3. 执行 docker build -t my-cherry-studio:latest . 进行构建
4. 如果对shell有了解，可以读下start.sh脚本，采用`chmod +x start.sh && ./start.sh v1`进行构建，其中`v1` 代表每次构建的版本号
5. 其中`dockerhub_user`是你在`hub.docker.com`的用户名，用于推送到`DockerHub`远程仓库，需要事先在宿主机通过`CLI`登录`DockerHub`
6. 端口依然是3000
7. cherry-studio的数据目录在/config/.config 目录下
8. 启动命令
```shell
docker run -d \
  --name=cherry-studio-cn \
  -p 3000:3000 \
  --user 0:0 \
  --cap-add SYS_ADMIN \
  --device /dev/fuse \
  -e PUID=0 \
  -e PGID=0 \
  -e TZ=Asia/Shanghai \
  -e WEBTOP_PRESET=high \
  -e WEBTOP_SCREEN_RESOLUTION=3840x2160 \
   -e SCALE_FACTOR=2 \
    -e PASSWORD="cherry-studio" \
  -v /root/cherry/config:/config \
  -v /root/cherry/data:/data/projects \
  --shm-size="1g" \
  --restart unless-stopped \
  my-cherry-studio:latest 

```