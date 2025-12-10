import React from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Paper,
  Divider,
  Switch,
  FormControlLabel,
  useTheme,
} from '@mui/material';
import {
  Cookie,
  Security,
  Analytics,
  Settings,
  Email,
  LocationOn,
  Info,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import LegalLayout from '../components/legal/LegalLayout';

const CookiePolicy = () => {
  const theme = useTheme();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <LegalLayout
      title="Cookie Policy"
      lastUpdated="March 15, 2024"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Box sx={{ mb: 6 }}>
          <motion.div variants={itemVariants}>
            <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main }}>
              What are Cookies?
            </Typography>
            <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2 }}>
              <Typography variant="body1" paragraph>
                Cookies are small text files that are placed on your device when you visit our website.
                They help us provide you with a better experience and enable certain features to work properly.
              </Typography>
            </Paper>
          </motion.div>
        </Box>

        <Box sx={{ mb: 6 }}>
          <motion.div variants={itemVariants}>
            <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main }}>
              Types of Cookies We Use
            </Typography>
            <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2 }}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Security color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Essential Cookies"
                    secondary="Required for basic website functionality and security"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Analytics color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Analytics Cookies"
                    secondary="Help us understand how visitors interact with our website"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Settings color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Preference Cookies"
                    secondary="Remember your settings and preferences"
                  />
                </ListItem>
              </List>
            </Paper>
          </motion.div>
        </Box>

        <Box sx={{ mb: 6 }}>
          <motion.div variants={itemVariants}>
            <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main }}>
              Cookie Settings
            </Typography>
            <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={<Switch defaultChecked disabled />}
                  label="Essential Cookies (Required)"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Analytics Cookies"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Preference Cookies"
                />
              </Box>
            </Paper>
          </motion.div>
        </Box>

        <Box sx={{ mb: 6 }}>
          <motion.div variants={itemVariants}>
            <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main }}>
              How to Control Cookies
            </Typography>
            <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2 }}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Settings color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Browser Settings"
                    secondary="You can control cookies through your browser settings"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Info color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Cookie Banner"
                    secondary="Use our cookie banner to manage your preferences"
                  />
                </ListItem>
              </List>
            </Paper>
          </motion.div>
        </Box>

        <Divider sx={{ my: 4 }} />

        <motion.div variants={itemVariants}>
          <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main }}>
            Contact Us
          </Typography>
          <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email color="primary" />
                <Typography>privacy@nestease.com</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn color="primary" />
                <Typography>123 Privacy Street, Security City, 12345</Typography>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      </motion.div>
    </LegalLayout>
  );
};

export default CookiePolicy; 
