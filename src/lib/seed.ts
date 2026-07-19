import { doc, writeBatch, collection } from 'firebase/firestore';
import { db } from './firebase';
import curriculum from '../data/curriculum.json';
import library from '../data/library.json';

export async function seedDatabase() {
  try {
    const batch = writeBatch(db);
    
    // Seed curriculum phases
    for (const phase of curriculum) {
      const phaseRef = doc(db, 'curriculum', phase.id);
      batch.set(phaseRef, phase);
    }

    // Seed library
    for (const resource of library) {
      const resourceRef = doc(db, 'library', resource.id);
      batch.set(resourceRef, resource);
    }

    await batch.commit();
    console.log('Database seeded successfully! (13 phases, 98 resources)');
    alert('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    alert('Error seeding database. Check console.');
  }
}
