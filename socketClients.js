const clients = [];

const addClient = ({ id, name, role }) => {
  if(name === undefined){
    return {error: 'Please login or register'}
  }
  const client = {id, name, role};
  clients.push(client);
  return { client };
}

const removeClient = (id) => {
  const index = clients.findIndex(client => client.id === id)
  if (index !== -1){
    return clients.splice(index, 1)[0]
  }
}

const getAllClients = () => {
  return {
    ...clients,
  }
};

const getClient = (id) => clients.find(client => client.id === id);

const getClientsByRole = (role) => clients.filter(client => client.role === role);

module.exports = {addClient, removeClient, getClient, getClientsByRole, getAllClients};
