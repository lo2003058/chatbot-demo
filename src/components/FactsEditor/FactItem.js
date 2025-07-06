'use client';
import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {updateFact, deleteFact, setEditing} from '@/store/slices/factsSlice';
import {PencilIcon, TrashIcon, CheckIcon, XMarkIcon} from '@heroicons/react/24/outline';
import moment from 'moment';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';

export default function FactItem({fact}) {
  const dispatch = useDispatch();
  const {isEditing, editingId} = useSelector(state => state.facts);
  const [editTitle, setEditTitle] = useState(fact.title);
  const [editContent, setEditContent] = useState(fact.content);

  const isCurrentlyEditing = isEditing && editingId === fact.id;

  const handleEdit = () => {
    setEditTitle(fact.title);
    setEditContent(fact.content);
    dispatch(setEditing({isEditing: true, id: fact.id}));
  };

  const handleSave = () => {
    if (editTitle.trim() && editContent.trim()) {
      dispatch(updateFact({
        id: fact.id,
        title: editTitle.trim(),
        content: editContent.trim(),
      }));
      dispatch(setEditing({isEditing: false}));
    }
  };

  const handleCancel = () => {
    setEditTitle(fact.title);
    setEditContent(fact.content);
    dispatch(setEditing({isEditing: false}));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this fact?')) {
      dispatch(deleteFact(fact.id));
    }
  };

  const formatCreatedDate = (timestamp) => {
    const now = moment();
    const createdTime = moment(timestamp);

    if (now.isSame(createdTime, 'day')) {
      return `Added today at ${createdTime.format('h:mm A')}`;
    } else if (now.diff(createdTime, 'days') === 1) {
      return `Added yesterday at ${createdTime.format('h:mm A')}`;
    } else if (now.diff(createdTime, 'days') < 7) {
      return `Added ${createdTime.format('dddd [at] h:mm A')}`;
    } else if (now.diff(createdTime, 'weeks') < 4) {
      return `Added ${createdTime.fromNow()}`;
    } else {
      return `Added ${createdTime.format('MMM D, YYYY [at] h:mm A')}`;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      {isCurrentlyEditing ? (
        <div className="space-y-4">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Fact title"
            className="font-medium"
          />
          <TextArea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Fact content"
            rows={4}
          />
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              variant="primary"
              size="sm"
              className="flex items-center gap-1"
            >
              <CheckIcon className="w-4 h-4"/>
              Save
            </Button>
            <Button
              onClick={handleCancel}
              variant="danger"
              size="sm"
              className="flex items-center gap-1"
            >
              <XMarkIcon className="w-4 h-4"/>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-gray-900">
              {fact.title}
            </h3>
            <div className="flex gap-2">
              <Button
                onClick={handleEdit}
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
                disabled={isEditing}
              >
                <PencilIcon className="w-4 h-4"/>
                Edit
              </Button>
              <Button
                onClick={handleDelete}
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                disabled={isEditing}
              >
                <TrashIcon className="w-4 h-4"/>
                Delete
              </Button>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {fact.content}
          </p>
          <div className="mt-3 text-sm text-gray-500">
            {formatCreatedDate(fact.createdAt)}
          </div>
        </div>
      )}
    </div>
  );
}
