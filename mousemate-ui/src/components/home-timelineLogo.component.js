import * as React from 'react';
import { Timeline, TimelineConnector, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator } from '@mui/lab';
import { withRouter } from '../common/with-router';
import { Box, IconButton, Typography } from '@mui/material';
import TodayIcon from '@mui/icons-material/Today';

function TimelineLogo(props) {

    return (
        <>
        <Box 
        sx={{
            display: 'flex',
            flexDirection: 'column',
            width: 'inherit',
            alignItems: 'center',
        }}>
        <TodayIcon sx={{ color: 'text.secondary', marginRight: 1}} />
        <Timeline
        position='left'
        sx={{
            p: 0,
            m: 0,
            paddingLeft: 3,
            paddingTop: 1.5
        }}
        >
            <TimelineItem>
                <TimelineSeparator>
                    <TimelineDot/>
                    <TimelineConnector/>
                </TimelineSeparator>
            </TimelineItem>
            <TimelineItem>
                <TimelineSeparator>
                    <TimelineDot/>
                    <TimelineConnector/>
                </TimelineSeparator>
            </TimelineItem>
            <TimelineItem>
                <TimelineSeparator>
                    <TimelineDot/>
                </TimelineSeparator>
            </TimelineItem>
        </Timeline>
        </Box>
        </>
    )

}

export default withRouter(TimelineLogo)
