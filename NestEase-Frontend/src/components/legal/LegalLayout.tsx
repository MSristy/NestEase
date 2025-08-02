import React from 'react';
import { Container, Box, Typography, Breadcrumbs, Link, Paper, Fade } from '@mui/material';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { motion } from 'framer-motion';

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

const LegalLayout: React.FC<LegalLayoutProps> = ({ title, lastUpdated, children }) => {
  const router = useRouter();

  return (
    <Box 
      sx={{ 
        bgcolor: 'background.default', 
        minHeight: '100vh', 
        py: 4,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)'
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Breadcrumbs 
            sx={{ 
              mb: 3,
              '& .MuiBreadcrumbs-separator': {
                color: 'primary.main'
              }
            }}
          >
            <Link 
              component={NextLink} 
              href="/" 
              color="inherit"
              sx={{
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline'
                }
              }}
            >
              Home
            </Link>
            <Typography color="text.primary">{title}</Typography>
          </Breadcrumbs>

          <Paper 
            elevation={3}
            sx={{ 
              bgcolor: 'background.paper', 
              borderRadius: 3,
              p: { xs: 2, md: 4 },
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255,255,255,0.18)'
            }}
          >
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                color: 'primary.main',
                mb: 2,
                textAlign: 'center',
                fontSize: { xs: '2rem', md: '2.5rem' },
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {title}
            </Typography>
            
            <Typography 
              variant="subtitle1" 
              color="text.secondary" 
              sx={{ 
                mb: 4,
                textAlign: 'center',
                fontStyle: 'italic'
              }}
            >
              Last updated: {lastUpdated}
            </Typography>

            <Box sx={{ 
              '& h2': { 
                mt: 4, 
                mb: 2,
                color: 'primary.main',
                fontWeight: 600,
                fontSize: '1.75rem',
                borderBottom: '2px solid',
                borderColor: 'primary.light',
                pb: 1,
                display: 'inline-block'
              },
              '& h3': { 
                mt: 3, 
                mb: 1.5,
                color: 'text.primary',
                fontWeight: 500,
                fontSize: '1.5rem'
              },
              '& p': { 
                mb: 2,
                lineHeight: 1.8,
                fontSize: '1.1rem',
                color: 'text.secondary'
              },
              '& ul': {
                mb: 2,
                pl: 3
              },
              '& li': {
                mb: 1.5,
                lineHeight: 1.8,
                fontSize: '1.1rem',
                color: 'text.secondary'
              }
            }}>
              <Fade in timeout={1000}>
                <div>{children}</div>
              </Fade>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default LegalLayout; 