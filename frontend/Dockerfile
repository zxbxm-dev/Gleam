FROM node:14.21.2
# 경로 설정
WORKDIR /app
# package.json 워킹 디렉토리에 복사
COPY package.json .
# 명령어 실행
RUN npm install
# 현재 디렉토리의 모든 파일을 도커 컨테이너의 워킹 디렉토리에 복사
COPY . .

# 3000번 포트 노출
EXPOSE 3000

CMD ["npm", "start"]