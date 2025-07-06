'use client';
import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {addFact} from '@/store/slices/factsSlice';
import {PlusIcon, TrashIcon} from '@heroicons/react/24/outline';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';

export default function AddFactForm() {
  const dispatch = useDispatch();
  const { isEditing } = useSelector(state => state.facts);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      dispatch(addFact({
        title: title.trim(),
        content: content.trim(),
      }));
      setTitle('');
      setContent('');
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    setTitle('');
    setContent('');
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Add New Fact
      </h3>
      <div className="space-y-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Fact title (e.g., 'Company founding date')"
          required
          disabled={isEditing}
        />
        <TextArea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Fact content (e.g., 'Our company was founded in 2015 by John Smith and Jane Doe in San Francisco.')"
          rows={4}
          required
          disabled={isEditing}
        />
        <div className="grid grid-cols-2 gap-6">
          <Button
            type="submit"
            variant="primary"
            className="flex items-center gap-2"
            disabled={!title.trim() || !content.trim() || isEditing}
          >
            <PlusIcon className="w-4 h-4"/>
            Add Fact
          </Button>
          <Button
            type="button"
            variant="danger"
            className="flex items-center gap-2"
            disabled={isEditing}
            onClick={handleClear}
          >
            <TrashIcon className="w-4 h-4"/>
            Clear
          </Button>
        </div>
      </div>
    </form>
  );
}
