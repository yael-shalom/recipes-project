import { Box, Typography, Button, Paper } from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

const NotFound = () => {
  const primaryColor = 'var(--primary-color)';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 62px)',
        background: 'black'
        // background: 'linear-gradient(135deg, #fffbe6 0%, #ffe0b2 100%)',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 5,
          borderRadius: 4,
          textAlign: 'center',
          bgcolor: '#fff',
          boxShadow: `0 4px 24px 0 ${primaryColor}33`,
          border: `2px solid ${primaryColor}`,
        }}
      >
        <RestaurantMenuIcon sx={{ fontSize: 72, color: primaryColor, mb: 2 }} />
        <Typography variant="h2" sx={{ color: primaryColor, fontWeight: 'bold' }} gutterBottom>
          404
        </Typography>
        <Typography variant="h6" color="text.primary" sx={{ mb: 2 }}>
          אופס! המתכון שחיפשת לא נמצא בתפריט שלנו.<br />
          אולי תנסה לחפש משהו אחר, או פשוט תתן לדמיון שלך להוביל אותך לטעמים חדשים?
        </Typography>
        <Button
          variant="contained"
          sx={{
            mt: 2,
            fontWeight: 'bold',
            borderRadius: 2,
            background: primaryColor,
            color: '#fff',
            '&:hover': {
              background: primaryColor,
              opacity: 0.85,
            },
          }}
          href="/"
        >
          חזרה לדף הבית
        </Button>
      </Paper>
    </Box>
  );
};

export default NotFound;