import React, { useRef } from 'react';
import { Header } from './entry';
import CarouselComponent from './midpage';
import { Whyus } from './whyus';
import { Mentors } from './mentors.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  const whyUsRef = useRef(null);       // For About Us
  const contactRef = useRef(null);     // 🔹 New: For Contact Us

  const scrollToWhyUs = () => {
    if (whyUsRef.current) {
      whyUsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    if (contactRef.current) {
      contactRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/homepage"
          element={
            <div className="App">
              <Header scrollToWhyUs={scrollToWhyUs} scrollToContact={scrollToContact} />
              <CarouselComponent />
              <Whyus refProp={whyUsRef} contactRef={contactRef} />
            </div>
          }
        />
        <Route path='/mentors' element={<Mentors />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
