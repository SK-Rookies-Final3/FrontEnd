FROM nginx:alpine

# Nginx 설정 파일 복사
#COPY nginx.conf /etc/nginx/nginx.conf

# React 앱의 빌드 결과물 복사
COPY ./build /usr/share/nginx/html

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
