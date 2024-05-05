import React, { useState, useEffect } from 'react';

import styled from 'styled-components';

const StyledClock = styled.div`
    display: inline-block;
    padding: 0.5rem 1.2rem;
    border: 0.1rem solid #007bff;
    border-radius: 12px;
    background-color: transparent;
    font-family: 'Digital', 'Arial', sans-serif;
    color: #007bff;
    font-size: 1.2rem;

`;


const DigitalClock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);

        return () => {
            clearInterval(timerId);
        };
    }, []);

    return (
        <StyledClock>
            {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
        </StyledClock>
    );
};

export default DigitalClock;
