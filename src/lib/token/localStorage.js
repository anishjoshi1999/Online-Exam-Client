export const saveEmailList = (name, emails) => {
  try {
    const savedLists = JSON.parse(localStorage.getItem('savedEmailLists') || '{}');
    savedLists[name] = emails;
    localStorage.setItem('savedEmailLists', JSON.stringify(savedLists));
    return true;
  } catch (error) {
    console.error('Error saving email list:', error);
    return false;
  }
};

export const getSavedEmailLists = () => {
  try {
    return JSON.parse(localStorage.getItem('savedEmailLists') || '{}');
  } catch (error) {
    console.error('Error getting saved email lists:', error);
    return {};
  }
};

export const deleteEmailList = (name) => {
  try {
    const savedLists = JSON.parse(localStorage.getItem('savedEmailLists') || '{}');
    delete savedLists[name];
    localStorage.setItem('savedEmailLists', JSON.stringify(savedLists));
    return true;
  } catch (error) {
    console.error('Error deleting email list:', error);
    return false;
  }
};