# Nginx를 베이스 이미지로 사용
FROM nginx:alpine

# 로컬에서 빌드된 정적 파일을 Nginx 디렉토리에 복사
COPY ./build /usr/share/nginx/html

# Nginx의 기본 포트 80 노출
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]