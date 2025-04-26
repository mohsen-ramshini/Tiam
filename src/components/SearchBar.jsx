// src/components/SearchBar.js
import { TextField } from '@mui/material';
import PropTypes from 'prop-types';

export default function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder="جستجو در سرویس، هاست، IP یا وضعیت..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      sx={{ mb: 2 }}
    />
  );
}

SearchBar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired
};
