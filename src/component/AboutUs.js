import React from "react";
import "./css/AboutUs.css";
import sheepImage from '../img/sheep.png';
import QuokkaImage from '../img/Quokka.png';
import bearImage from '../img/bear.png';
import dogImage from '../img/dog.png'
import RacconImage from '../img/Raccon.png';
import catImage from '../img/cat.png';
import rabbitImage from '../img/rabbit.png';
import tigerImage from '../img/tiger.png';
import phoenixImage from '../img/phoenix.png';
import mentorImage from '../img/mentor.png';

const AboutUs = () => {
  return (
    <div className="about-container">
      <h2 className="about-title">404 Not Found</h2>
      <p className="about-smalltitle">(하지만 언제나 완벽한 솔루션을 제공하는 팀)</p>
      <p className="about-smalltitle" style={{marginBottom: '70px'}}>ShortPing9은 빠르게 변화하는 트렌드를 한눈에 보여주는 공간입니다.<br/> 짧은 영상에 담긴 실감나는 제품 사용법과 리뷰를 통해, 고객은 구매 전에 보다 생생한 정보를 얻을 수 있습니다.<br/> 이를 통해 단순히 상품을 구매하는 것을 넘어, 자신의 스타일에 맞는 특별한 선택을 할 수 있습니다</p>
      <div className="about">
        <div className="main-card">
          <div className="additional">
            <div className="user-card">
              <div className="level about">한정헌 멘토님</div>
              <div className="points about">멘토님</div>
              <SVGIcon src={mentorImage}/>
            </div>
            <div className="more-info">
              <h1 style={{ fontFamily: 'continuous' }}>Mentor</h1>
              <div className="coords">
                <span>멘토님 소개</span>
              </div>
            </div>
          </div>
          <div className="general">
            <h1 style={{ fontFamily: 'continuous' }} >Mentor</h1>
            <p>멘토님 소개</p>
          </div>
        </div>

        <div className="main-card green">
          <div className="additional">
            <div className="user-card">
              <div className="level about">우예리</div>
              <div className="points about">예리한 예리</div>
              <SVGIcon src={sheepImage} />
            </div>
            <div className="more-info">
              <h1 style={{ fontFamily: 'continuous' }}>Leader & Back-end</h1>
              <div className="coords">
                <span style={{ fontFamily: 'continuous' }}>AI</span>
              </div>
            </div>
          </div>
          <div className="general">
            <h1 style={{ fontFamily: 'continuous' }}>Leader & Backend</h1>
            <p>
              이번 팀 활동에서 스크럼 마스터이자 척척 박사들 사이 쩝쩝 박사로 함께 참여하게 된
              우예리 입니다. 좋은 사람들과 열정적으로 좋은 프로젝트에 대하여 
              논하며 작업을 진행할 수 있어서 좋았습니다.
            </p>
          </div>
        </div>
        <div className="main-card green">
          <div className="additional">
            <div className="user-card">
              <div className="level about">강민수</div>
              <div className="points about">민숭구리당당</div>
              <SVGIcon src={dogImage}/>
            </div>
            <div className="more-info">
              <h1 style={{ fontFamily: 'continuous' }}>Front-end</h1>
              <div className="coords">
                <span style={{ fontFamily: 'continuous' }}>Back-end</span>
              </div>
            </div>
          </div>
          <div className="general">
            <h1 style={{ fontFamily: 'continuous' }}>Front-end</h1>
            <p>
            안녕하세요! 사용자 경험을 최우선으로 고려하여 프론트엔드 개발을 맡은 강민수입니다. 
            팀원들과 협력해 UI/UX 일관성을 높이고 데이터 처리와 API 연동을 최적화해 사용자 인터페이스의 편리성을 크게 향상시킬 수 있었습니다. 
            앞으로도 함께 성장하며 좋은 결과를 만들어가고 싶습니다.
            </p>
          </div>
        </div>
        <div className="main-card green">
          <div className="additional">
            <div className="user-card">
              <div className="level about">장나영</div>
              <div className="points about">자나요</div>
              <SVGIcon src={QuokkaImage}/>
            </div>
            <div className="more-info">
              <h1 style={{ fontFamily: 'continuous' }}>Front-end</h1>
              <div className="coords">
                <span style={{ fontFamily: 'continuous' }}>Back-end</span>
              </div>
            </div>
          </div>
          <div className="general">
            <h1 style={{ fontFamily: 'continuous' }}>Front-end</h1>
            <p>
            안녕하세요! 저는 프론트를 맡은 “자나요”입니다. 제 별명이 자나요인 이유는 잠이 많기 때문이랍니다!
            정말 좋은 팀원들을 만날 수 있어서 행운이었습니다. 덕분에 좋은 정보도 많이 얻고,
            배울 점이 많았던 시간이었습니다. 모두들 감사합니다
            </p>
          </div>
        </div>
        <div className="main-card green">
          <div className="additional">
            <div className="user-card">
              <div className="level about">백지연</div>
              <div className="points about">미룬이</div>
              <SVGIcon src={RacconImage}/>
            </div>
            <div className="more-info">
              <h1 style={{ fontFamily: 'continuous' }}>Back-end</h1>
              <div className="coords">
                <span style={{ fontFamily: 'continuous' }}>Front-end</span>
              </div>
            </div>
          </div>
          <div className="general">
            <h1 style={{ fontFamily: 'continuous' }}>Back-end</h1>
            <p>
            안녕하세요! 프로젝트에서 백엔드를 담당한 백지연입니다. 
            72일간 하나의 목표를 가지고 열심히 달려오느라 고생 많으셨고 좋은 사람들과 소중한 경험을 할 수 있어서 영광이었습니다. 
            </p>
          </div>
        </div>
        <div className="main-card green">
          <div className="additional">
            <div className="user-card">
              <div className="level about">이선희</div>
              <div className="points about">써니데이</div>
              <SVGIcon src={catImage}/>
            </div>
            <div className="more-info">
              <h1 style={{ fontFamily: 'continuous' }}>Back-end</h1>
              <div className="coords">
                <span style={{ fontFamily: 'continuous' }}>Front-end</span>
              </div>
            </div>
          </div>
          <div className="general">
            <h1 style={{ fontFamily: 'continuous' }}>Back-end</h1>
            <p>
            안녕하세요 백엔드 담당 이선희입니다. 백엔드 개발이 너무 좋아서 이쪽으로 왔는데, 
            어제 되던게 오늘 안되면 눈물 좔좔이예요(이유는 모름^^;;) 
            데굴데굴 잘 굴러가는 웹페이지 만들어보겠습니다! 팀원 모두 화이팅이예요
            </p>
          </div>
        </div>
        <div className="main-card green">
          <div className="additional">
            <div className="user-card">
              <div className="level about">황서정</div>
              <div className="points about">서뎡뎡</div>
              <SVGIcon src={rabbitImage}/>
            </div>
            <div className="more-info">
              <h1 style={{ fontFamily: 'continuous' }}>DevOps</h1>
              <div className="coords">
                <span style={{ fontFamily: 'continuous' }}>Front-end</span>
              </div>
            </div>
          </div>
          <div className="general">
            <h1 style={{ fontFamily: 'continuous' }}>DevOps</h1>
            <p>
            안녕하세요! 이번 프로젝트에서 DevOps 엔지니어로 클라우드 인프라 구축, 배포 자동화, CI/CD 파이프라인을 담당한 황서정입니다. 
            팀원들과 협력하며 많은 것을 배우고 성장할 수 있어 함께한 시간이 정말 값졌습니다! 
            또한, 개발자로서 경험을 많이 쌓을 수 있었습니다 ! 너무너무 감사합니다
            </p>
          </div>
        </div>
        <div className="main-card green">
          <div className="additional">
            <div className="user-card">
              <div className="level about">김민재</div>
              <div className="points about">민재민재</div>
              <SVGIcon src={bearImage}/>
            </div>
            <div className="more-info">
              <h1 style={{ fontFamily: 'continuous' }}>DevOps</h1>
              <div className="coords">
                <span style={{ fontFamily: 'continuous' }}>Back-end</span>
              </div>
            </div>
          </div>
          <div className="general">
            <h1 style={{ fontFamily: 'continuous' }}>DevOps</h1>
            <p>
            이번 프로젝트에서 DevOps, CICD Pipeline을 맡은 김민재입니다. 
            이 분야는 처음이라 열심히 공부하며 프로젝트를 진행했습니다. 
            정말 실력 있는 팀원과 함께하면서 정말 많은 것들을 도움받으며 배웠고, 제 개발자 인생 중 잊을 수 없는 소중한 추억이 될 것 같습니다. 다들 감사합니다!
            </p>
          </div>
        </div>
        <div className="main-card green">
          <div className="additional">
            <div className="user-card">
              <div className="level about">정우석</div>
              <div className="points about">와석이</div>
              <SVGIcon src={tigerImage}/>
            </div>
            <div className="more-info">
              <h1 style={{ fontFamily: 'continuous' }}>AI</h1>
              <div className="coords">
                <span style={{ fontFamily: 'continuous' }}>Front-end</span>
              </div>
            </div>
          </div>
          <div className="general">
            <h1 style={{ fontFamily: 'continuous' }}>AI</h1>
            <p>
            안녕하세요 이번 프로젝트에서 AI를 담당하여 감정 필터링과 사용자 맞춤 상품 AI 추천 시스템 개발을 맡은 정우석입니다. 
            좋은 팀원들과 함께 프로젝트를 진행할 수 있어서 좋았습니다. 감사합니다.
            </p>
          </div>
        </div>
        <div className="main-card green">
          <div className="additional">
            <div className="user-card">
              <div className="level about">홍민혁</div>
              <div className="points about">민혁민혁</div>
              <SVGIcon src={phoenixImage}/>
            </div>
            <div className="more-info">
              <h1 style={{ fontFamily: 'continuous' }}>Platform Pipeline</h1>
              <div className="coords">
                <span style={{ fontFamily: 'continuous' }}>DevOps</span>
              </div>
            </div>
          </div>
          <div className="general">
            <h1 style={{ fontFamily: 'continuous' }}>Platform Pipeline</h1>
            <p>
            안녕하세요.  MSA 기반 데이터 파이프라인 개발 및 관할을 맡은 홍민혁입니다. 
            실력 좋은 팀원들과 함께 프로젝트를 진행할 수 있어서 좋았습니다. 감사합니다.
            </p>
          </div>
        </div>
      
      </div>
    </div>
  );
};

// SVG Icon Component
const SVGIcon = ({ src }) => (
  <div className="icon-container">
    <img
      src={src}
      alt="Profile"
      className="about-icon"
    />
  </div>
);

export default AboutUs;