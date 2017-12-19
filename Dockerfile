FROM nginx:1.13.3-alpine
MAINTAINER Say.li <120011676@qq.com>

ENV TZ Asia/Shanghai
RUN apk --update add tzdata && ln -sf /usr/share/zoneinfo/${TZ} /etc/localtime && echo ${TZ} > /etc/timezone

COPY html /usr/share/nginx/html

EXPOSE 80