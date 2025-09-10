import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

import './PopularContent.css';
import 'swiper/css';
import 'swiper/css/pagination';

const PopularContent = () => {
  const contentData = [
    {
      cardImg: "https://via.placeholder.com/300x160.png?text=Card+1",
      cardTitle: "Card title 1",
      cardText: "This is a description for card 1."
    },
    {
      cardImg: "https://via.placeholder.com/300x160.png?text=Card+2",
      cardTitle: "Card title 2",
      cardText: "This is a description for card 2."
    },
    {
      cardImg: "https://via.placeholder.com/300x160.png?text=Card+3",
      cardTitle: "Card title 3",
      cardText: "This is a description for card 3."
    },
    {
      cardImg: "https://via.placeholder.com/300x160.png?text=Card+4",
      cardTitle: "Card title 4",
      cardText: "This is a description for card 4."
    }
  ];

  return (
    <div className="popular-content-container">
        <h3 className="popular-content-heading">Popular Resources</h3>
        <Swiper
          modules={[Pagination]}
          slidesPerView={1.1} 
          spaceBetween={15}
          grabCursor
          pagination={{ clickable: true }}
          style={{
            '--swiper-pagination-color': '#008080',
            '--swiper-pagination-bullet-inactive-color': '#333333',
            '--swiper-pagination-bullet-inactive-opacity': '0.5',
            '--swiper-pagination-bullet-size': '10px',
          }}

          breakpoints={
              {
                  768: {slidesPerView: 2, spaceBetween: 20},
                  1020: {slidesPerView: 2, spaceBetween: 50},
              }

          }
        
        >
        {contentData.map((data, index) => (
          <SwiperSlide key={index}>
            <div className="content-grid">
                <div className="content-card">
                    <div className="card-img-placeholder">
                        <img src={data.cardImg} alt={data.cardTitle} />
                    </div>
                    <h2 className="card-title">{data.cardTitle}</h2>
                    <p className="card-text">{data.cardText}</p>
                </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
        
    </div>
  );
};

export default PopularContent;