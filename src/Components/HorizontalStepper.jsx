import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { styled } from '@mui/material/styles';
import { Data } from '../Context/Store';

const steps = [
    { id: 1, label: 'Teaching Performance', value: 'Teaching' },
    { id: 2, label: 'Research Performance', value: 'Research' },
    { id: 3, label: 'Service Performance', value: 'Service' },
];

const stepIndexMap = {
    Teaching: 0,
    Research: 1,
    Service: 2,
};

// ✅ Custom connector for horizontal
const CustomConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22,
    },
    [`& .${stepConnectorClasses.line}`]: {
        borderTopStyle: 'dotted',
        borderTopWidth: 2,
    },
}));

// ✅ Custom step icon
const CustomStepIcon = (props) => {
    const { active, icon } = props;
    return (
        <div
            className={`flex items-center justify-center w-8 h-8 rounded-full font-bold 
        ${active ? 'bg-black text-white' : 'bg-gray-400 text-black'}`}
        >
            {icon}
        </div>
    );
};

const HorizontalStepper = () => {
    const { selectedTab } = useContext(Data);

    return (
        <div className="main-container  rounded-xl ">
            <div className="header mb-1">
                <h1 className="text-md">
                    Step <span>{stepIndexMap[selectedTab] + 1}</span>
                </h1>
                {/* <p className="text-[#5d666e] text-sm mt-2">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry
                </p> */}
            </div>
            <Box sx={{ width: '100%' }}>
                <Stepper
                    activeStep={stepIndexMap[selectedTab]}
                    alternativeLabel
                    connector={<CustomConnector />}
                >
                    {steps.map((step) => (
                        <Step key={step.id}>
                            <StepLabel
                                StepIconComponent={CustomStepIcon}
                                sx={{ '.MuiStepLabel-label': { fontSize: '12px' } }}
                            >
                                {step.label}
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
        </div>
    );
};

export default HorizontalStepper;
