FROM nginx:1.13.3-alpine
MAINTAINER Say.li <120011676@qq.com>

# 原utc时间，修改成cst（中国标准东八区时间）
ENV TZ Asia/Shanghai
RUN apk --update add ca-certificates && \
    apk add tzdata && \
    ln -sf /usr/share/zoneinfo/${TZ} /etc/localtime && \
    echo ${TZ} > /etc/timezone

COPY html /usr/share/nginx/html

EXPOSE 80