
import React from 'react';
import image1 from './assets/image1.jpg';

const CarouselComponent = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: '90vh',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '2rem',
        gap: '2rem',
        flexWrap: 'nowrap',
      }}
    >
      {/* Left Side: Heading and Subheading */}
      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' ,fontFamily:'arial'}}>
          Welcome to Our Platform
        </h1>
        <p style={{ fontSize: '1rem', lineHeight: '1.6' }}>
          Join us to explore amazing opportunities, connect with mentors,
          and grow your skills with the support of a vibrant community.
        </p>
      </div>

      {/* Right Side: Image */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <img
          src={image1}
          alt="Slide"
          style={{
            width: '90%',
            height: '80vh',
            objectFit: 'cover',
            borderRadius: '6px',
          }}
        />
      </div>
    </div>
  );
};

export default CarouselComponent;
