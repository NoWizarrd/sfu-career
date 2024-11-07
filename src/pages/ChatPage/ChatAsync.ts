
interface Participant { 
    _id: string;
    name?: string; 
    surname?: string;
  }

export const fetchChats = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:4444/chats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  
    const data = await response.json();
    return data;
  };
  
 export const fetchMessages = async (chatId: string) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:4444/chats/${chatId}/messages`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  
    const data = await response.json();
    return data;
  };
  
 export const fetchParticipant = async (id: string, model: string): Promise<Participant> => {
    const token = localStorage.getItem("token");
    const endpoint = model === "Company" ? "companies" : "students";
    const response = await fetch(`http://localhost:4444/${endpoint}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  
    const data = await response.json();
    return data;
  };


