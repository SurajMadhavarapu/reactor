import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';
import { Idea, Comment, Collaborator } from '@/app/types';

// CREATE IDEA
export async function createIdea(
  userId: string,
  userName: string,
  title: string,
  description: string,
  category: string
) {
  try {
    // Generate random 6-digit PIN
    const pin = String(Math.floor(100000 + Math.random() * 900000));

    const ideasRef = collection(db, 'ideas');
    const docRef = await addDoc(ideasRef, {
      title,
      description,
      category,
      ownerId: userId,
      ownerName: userName,
      progress: 'concept',
      upvotes: 0,
      upvoters: [],
      commentCount: 0,
      pin,
      pinVerified: { [userId]: true },
      collaborators: [
        {
          userId,
          username: userName,
          role: 'owner',
          joinedAt: new Date(),
        },
      ],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      progressHistory: [],
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating idea:', error);
    throw error;
  }
}

// GET ALL IDEAS
export async function getAllIdeas() {
  try {
    const ideasRef = collection(db, 'ideas');
    const q = query(ideasRef);
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as any[];
  } catch (error) {
    console.error('Error fetching ideas:', error);
    throw error;
  }
}

// GET SINGLE IDEA
export async function getIdeaById(ideaId: string) {
  try {
    const ideaRef = doc(db, 'ideas', ideaId);
    const snapshot = await getDoc(ideaRef);
    if (!snapshot.exists()) {
      throw new Error('Idea not found');
    }
    return { id: snapshot.id, ...snapshot.data() } as any;
  } catch (error) {
    console.error('Error fetching idea:', error);
    throw error;
  }
}

// UPDATE IDEA PROGRESS
export async function updateIdeaProgress(
  ideaId: string,
  newProgress: string,
  userId: string,
  userName: string
) {
  try {
    const ideaRef = doc(db, 'ideas', ideaId);
    await updateDoc(ideaRef, {
      progress: newProgress,
      updatedAt: serverTimestamp(),
      progressHistory: arrayUnion({
        userId,
        userName,
        toStage: newProgress,
        timestamp: new Date(),
      }),
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    throw error;
  }
}

// UPVOTE IDEA
export async function upvoteIdea(ideaId: string, userId: string) {
  try {
    const ideaRef = doc(db, 'ideas', ideaId);
    await updateDoc(ideaRef, {
      upvotes: increment(1),
      upvoters: arrayUnion(userId),
    });
  } catch (error) {
    console.error('Error upvoting:', error);
    throw error;
  }
}

// REMOVE UPVOTE
export async function removeUpvote(ideaId: string, userId: string) {
  try {
    const ideaRef = doc(db, 'ideas', ideaId);
    await updateDoc(ideaRef, {
      upvotes: increment(-1),
      upvoters: arrayRemove(userId),
    });
  } catch (error) {
    console.error('Error removing upvote:', error);
    throw error;
  }
}

// ADD COMMENT
export async function addComment(
  ideaId: string,
  userId: string,
  userName: string,
  content: string
) {
  try {
    const commentsRef = collection(db, 'ideas', ideaId, 'comments');
    const docRef = await addDoc(commentsRef, {
      userId,
      userName,
      content,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Update comment count
    const ideaRef = doc(db, 'ideas', ideaId);
    await updateDoc(ideaRef, {
      commentCount: increment(1),
    });

    return docRef.id;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
}

// GET COMMENTS
export async function getComments(ideaId: string) {
  try {
    const commentsRef = collection(db, 'ideas', ideaId, 'comments');
    const q = query(commentsRef);
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as any[];
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
}

// DELETE IDEA
export async function deleteIdea(ideaId: string) {
  try {
    const ideaRef = doc(db, 'ideas', ideaId);
    await deleteDoc(ideaRef);
  } catch (error) {
    console.error('Error deleting idea:', error);
    throw error;
  }
}

// ADD COLLABORATOR
export async function addCollaborator(
  ideaId: string,
  userId: string,
  userName: string,
  role: string = 'collaborator'
) {
  try {
    const ideaRef = doc(db, 'ideas', ideaId);
    await updateDoc(ideaRef, {
      collaborators: arrayUnion({
        userId,
        username: userName,
        role,
        joinedAt: new Date(),
      }),
      pinVerified: {
        [userId]: true,
      },
    });
  } catch (error) {
    console.error('Error adding collaborator:', error);
    throw error;
  }
}

// VERIFY IDEA PIN
export async function verifyIdeaPin(ideaId: string, userId: string, userName: string, enteredPin: string) {
  try {
    const ideaRef = doc(db, 'ideas', ideaId);
    const snapshot = await getDoc(ideaRef);
    
    if (!snapshot.exists()) {
      throw new Error('Idea not found');
    }

    const idea = snapshot.data();
    if (idea.pin !== enteredPin) {
      throw new Error('Invalid PIN');
    }

    // Check if user is already a collaborator
    const existingCollab = idea.collaborators?.find((c: any) => c.userId === userId);
    
    // If not already a collaborator, add them
    if (!existingCollab) {
      const newCollaborator = {
        userId,
        username: userName,
        role: 'collaborator',
        joinedAt: new Date(),
      };

      await updateDoc(ideaRef, {
        [`pinVerified.${userId}`]: true,
        collaborators: arrayUnion(newCollaborator),
      });
    } else {
      // Just mark as verified
      await updateDoc(ideaRef, {
        [`pinVerified.${userId}`]: true,
      });
    }

    return true;
  } catch (error) {
    console.error('Error verifying PIN:', error);
    throw error;
  }
}

// UPDATE COLLABORATOR ROLE
export async function updateCollaboratorRole(ideaId: string, userId: string, newRole: string) {
  try {
    const ideaRef = doc(db, 'ideas', ideaId);
    const snapshot = await getDoc(ideaRef);
    
    if (!snapshot.exists()) {
      throw new Error('Idea not found');
    }

    const idea = snapshot.data();
    const collaborators = idea.collaborators || [];
    
    // Find and update the collaborator
    const updatedCollaborators = collaborators.map((collab: any) =>
      collab.userId === userId ? { ...collab, role: newRole } : collab
    );

    await updateDoc(ideaRef, {
      collaborators: updatedCollaborators,
    });

    return true;
  } catch (error) {
    console.error('Error updating collaborator role:', error);
    throw error;
  }
}

// REMOVE COLLABORATOR (LEAVE IDEA)
export async function removeCollaborator(ideaId: string, userId: string) {
  try {
    const ideaRef = doc(db, 'ideas', ideaId);
    const snapshot = await getDoc(ideaRef);
    
    if (!snapshot.exists()) {
      throw new Error('Idea not found');
    }

    const idea = snapshot.data();
    const collaborators = idea.collaborators || [];
    
    // Filter out the user
    const updatedCollaborators = collaborators.filter((collab: any) => collab.userId !== userId);

    await updateDoc(ideaRef, {
      collaborators: updatedCollaborators,
      [`pinVerified.${userId}`]: false,
    });

    return true;
  } catch (error) {
    console.error('Error removing collaborator:', error);
    throw error;
  }
}

// LISTEN TO COMMENTS IN REAL-TIME
export function listenToComments(ideaId: string, callback: (comments: any[]) => void, onError?: (error: Error) => void) {
  try {
    const commentsRef = collection(db, 'ideas', ideaId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const comments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(comments as any[]);
    }, (error) => {
      console.error('Error listening to comments:', error);
      if (onError) onError(error);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error setting up comments listener:', error);
    throw error;
  }
}
