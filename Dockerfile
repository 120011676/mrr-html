FROM nginx:1.13.0-alpine
MAINTAINER Say.li <120011676@qq.com>

# 原utc时间，修改成cst（中国标准东八区时间）
ENV TZ Asia/Shanghai
RUN echo "时间修改中（原UTC时间，修改成CST（中国标准东八区）时间）。。。" && \
    apk --update add ca-certificates && \
    apk add tzdata && \
    ln -sf /usr/share/zoneinfo/${TZ} /etc/localtime && \
    echo ${TZ} > /etc/timezone

COPY . /usr/share/nginx/html

# 设置mrr-server地址
# ENV MRR_SERVER_BASE_URL http://localhost:8080
# RUN sed -i "44i \ \
# \n\
#     location mrr-server/ {\n\
#  		proxy_pass\t`echo ${MRR_SERVER_BASE_URL} | awk '{if($1==""){printf("http://localhost:8080")}else{$1}}'`;\n\
#     }" /etc/nginx/conf.d/default.conf
RUN sed -i "7i \ \
\n\
    location /mrr/ {\n\
        proxy_pass\thttp://10.9.39.69:8080/;\n\
    }" /etc/nginx/conf.d/default.conf

EXPOSE 80