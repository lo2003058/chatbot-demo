'use client';
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {loadFacts} from '@/store/slices/factsSlice';
import FactItem from './FactItem';
import AddFactForm from './AddFactForm';

export default function FactsEditor() {
  const dispatch = useDispatch();
  const {facts, isEditing} = useSelector(state => state.facts);

  useEffect(() => {
    // Load facts from localStorage on component mount
    const savedFacts = localStorage.getItem('pocket-knowledge-facts');
    if (savedFacts) {
      dispatch(loadFacts(JSON.parse(savedFacts)));
    }
  }, [dispatch]);

  useEffect(() => {
    // Save facts to localStorage whenever facts change
    localStorage.setItem('pocket-knowledge-facts', JSON.stringify(facts));
  }, [facts]);

  return (
    <div className="p-12">
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>
        <div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Knowledge Base
            </h1>
            <p className="text-gray-600">
              Add facts that your chatbot can reference when answering questions.
            </p>
          </div>
          <AddFactForm/>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Your Facts ({facts.length})
          </h2>

          {facts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">No facts added yet</p>
              <p className="text-gray-400 text-sm mt-2">
                Start by adding your first fact above
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {facts
                .slice()
                .reverse()
                .map(fact => (
                  <FactItem key={fact.id} fact={fact}/>
                ))
              }
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
