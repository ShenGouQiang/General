#!/bin/bash

# 设置时区
export TZ="Asia/Shanghai"

# 获取docker版本和基本信息
docker_version=$1
current_directory=$(pwd)
formatted_time=$(date "+%Y-%m-%d %H:%M:%S")

# 设定关键变量
image_name="cherry-studio"
dockerhub_user="XXX"

# 输出参数
echo "Docker版本是: $docker_version"
echo "当前工作目录是: $current_directory"

# 写入版本信息
echo "$docker_version" > "$current_directory/version"
echo "$formatted_time" >> "$current_directory/version"

# 删除原有镜像
unique_ids=$(docker images | grep "$image_name" | awk '{print $3}' | sort -u)
if [[ -n "$unique_ids" ]]; then
    echo "找到唯一的镜像 ID: $unique_ids"
    
    # 执行删除操作
    docker rmi -f $unique_ids
    echo "已删除镜像 ID: $unique_ids"
else
    echo "没有找到匹配的镜像 ID。"
fi

# 构建镜像
docker build -t "${image_name}:${docker_version}" -f Dockerfile "$current_directory"

# 打标签（版本号）
docker tag "${image_name}:${docker_version}" "${dockerhub_user}/${image_name}:${docker_version}"

# 推送版本镜像
docker push "${dockerhub_user}/${image_name}:${docker_version}"

# 设置并推送 latest 标签
docker tag "${dockerhub_user}/${image_name}:${docker_version}" "${dockerhub_user}/${image_name}:latest"
docker push "${dockerhub_user}/${image_name}:latest"
