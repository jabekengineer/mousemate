import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button, Tooltip, Typography, Box} from '@mui/material';
import { withRouter } from '../common/with-router';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';

function ParentLinkButton(props) {
    const cage = props.cageNum;
    return (
        <>
        { props.cageNum && 
        <>
            <Link
            to={"/event/" + cage}
            style={{textDecoration: 'none'}}>
            <Tooltip title="View Parent Cage" placement='top'>
                <Button variant='outlined' style={{textTransform: 'none', paddingBottom: '0px', marginBottom: '6px', marginLeft: '2%'}} >
                    <FamilyRestroomIcon />
                </Button>
            </Tooltip>
            </Link>
        </> 
         }
         {
            !props.cageNum && 
            <> 
            <Tooltip title="Parent Cage Not Available" placement='top'>
                <span>
                <Button disabled variant='outlined' style={{textTransform: 'none', paddingBottom: '0px', marginBottom: '6px', marginLeft: '2%'}} >
                    <FamilyRestroomIcon />
                </Button>
                </span>
            </Tooltip>
            </>
         }
        </>
    )
}

export default withRouter(ParentLinkButton)