import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';
import {JSONPath} from 'jsonpath-plus';
import PostCard from './PostCard';

import { useSelector } from 'react-redux';
import { selectCurrentPost } from '../features/currentPostSlice';
import { getPostsJson } from '../features/allPostsSlice';


const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
    overflow: "hidden",
    [theme.breakpoints.down('md')]: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      marginTop: theme.spacing(2),
    },
  },
  tabContainer: {
    [theme.breakpoints.down('md')]: {
      maxWidth: "60vw"
    },
    maxWidth: "40vw"
  }
  
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function PostsContainer(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const blogData = useSelector(getPostsJson);


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return(
    <div className={classes.root}>
      <div>
          <div className={classes.tabContainer}>
            <Tabs
              variant="scrollable"
              scrollButtons="on"
              value={value}
              onChange={handleChange}
              aria-label="lineage selector">
              {
                blogData.categories.map((label, index) => (
                  <Tab key={index+"tab-section"} label={label} {...a11yProps(index)} />
                ))
              }
            </Tabs>
          </div>
        {
          blogData.categories.map((label, index) => {
            return (
              <TabPanel value={value} index={index} key={index+"tab"}>
                <Grid container spacing={0}>
                  {
                    JSONPath({path: `$.posts[?(@.category === '${label}')]`, json: blogData}).map((post) => (
                      <Grid item xs={12} sm={4} key={post.id}>
                        <PostCard post={post}/>
                      </Grid>
                    ))
                  }
                </Grid>
              </TabPanel>
            );
          })
        }
      </div>
    </div>
  );
}

export default PostsContainer;
