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
  Alert,
  useTheme,
} from '@mui/material';
import {
  AccountCircle,
  Payment,
  Gavel,
  Warning,
  Email,
  LocationOn,
  Update,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import LegalLayout from '../components/legal/LegalLayout';

const TermsOfService = () => {
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
      title="Terms of Service"
      lastUpdated="March 15, 2024"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Alert severity="info" sx={{ mb: 4 }}>
          Please read these terms carefully before using our services.
        </Alert>

        <Box sx={{ mb: 6 }}>
          <motion.div variants={itemVariants}>
            <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main }}>
              Account Responsibilities
            </Typography>
            <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2 }}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <AccountCircle color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Account Creation"
                    secondary="You must provide accurate and complete information when creating your account"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Warning color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Security"
                    secondary="You are responsible for maintaining the security of your account credentials"
                  />
                </ListItem>
              </List>
            </Paper>
          </motion.div>
        </Box>

        <Box sx={{ mb: 6 }}>
          <motion.div variants={itemVariants}>
            <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main }}>
              Payment Terms
            </Typography>
            <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2 }}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Payment color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Billing"
                    secondary="All payments are processed securely and in accordance with our billing policies"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Update color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Subscription"
                    secondary="Subscriptions automatically renew unless cancelled before the renewal date"
                  />
                </ListItem>
              </List>
            </Paper>
          </motion.div>
        </Box>

        <Box sx={{ mb: 6 }}>
          <motion.div variants={itemVariants}>
            <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main }}>
              Legal Compliance
            </Typography>
            <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2 }}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Gavel color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Laws and Regulations"
                    secondary="You must comply with all applicable laws and regulations while using our services"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Warning color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Prohibited Activities"
                    secondary="Any illegal or unauthorized use of our services is strictly prohibited"
                  />
                </ListItem>
              </List>
            </Paper>
          </motion.div>
        </Box>

        <Divider sx={{ my: 4 }} />

        <motion.div variants={itemVariants}>
          <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main }}>
            Changes to Terms
          </Typography>
          <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2 }}>
            <Typography variant="body1" paragraph>
              We reserve the right to modify these terms at any time. We will notify you of any material changes
              via email or through our platform.
            </Typography>
          </Paper>
        </motion.div>

        <Box sx={{ mt: 4 }}>
          <motion.div variants={itemVariants}>
            <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main }}>
              Contact Information
            </Typography>
            <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email color="primary" />
                  <Typography>legal@nestease.com</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn color="primary" />
                  <Typography>123 Legal Street, Compliance City, 12345</Typography>
                </Box>
              </Box>
            </Paper>
          </motion.div>
        </Box>
      </motion.div>
    </LegalLayout>
  );
};

export default TermsOfService; 
