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
  Chip,
  useTheme,
} from '@mui/material';
import {
  Security,
  Person,
  Storage,
  Delete,
  Edit,
  Visibility,
  Download,
  Email,
  LocationOn,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import LegalLayout from '../components/legal/LegalLayout';

const PrivacyPolicy = () => {
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
      title="Privacy Policy"
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
              Information We Collect
            </Typography>
            <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2 }}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Person color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Personal Information"
                    secondary="Name, email, phone number, and address"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Storage color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Usage Data"
                    secondary="IP address, browser type, and device information"
                  />
                </ListItem>
              </List>
            </Paper>
          </motion.div>
        </Box>

        <Box sx={{ mb: 6 }}>
          <motion.div variants={itemVariants}>
            <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main }}>
              How We Use Your Information
            </Typography>
            <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2 }}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Security color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Security"
                    secondary="To protect your account and prevent fraud"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Edit color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Improvements"
                    secondary="To enhance our services and user experience"
                  />
                </ListItem>
              </List>
            </Paper>
          </motion.div>
        </Box>

        <Box sx={{ mb: 6 }}>
          <motion.div variants={itemVariants}>
            <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main }}>
              Your Rights
            </Typography>
            <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2 }}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Visibility color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Access"
                    secondary="View your personal data"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Edit color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Update"
                    secondary="Modify your information"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Delete color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Delete"
                    secondary="Request data deletion"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Download color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Export"
                    secondary="Download your data"
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

        <Box sx={{ mt: 4, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            icon={<Security />}
            label="GDPR Compliant"
            color="primary"
            variant="outlined"
          />
          <Chip
            icon={<Security />}
            label="CCPA Compliant"
            color="primary"
            variant="outlined"
          />
          <Chip
            icon={<Security />}
            label="HIPAA Compliant"
            color="primary"
            variant="outlined"
          />
        </Box>
      </motion.div>
    </LegalLayout>
  );
};

export default PrivacyPolicy; 