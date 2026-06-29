import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Layout from '../components/Layout';
import api from '../utils/api';

const STAGES = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];

const stageColors = {
  New: 'border-blue-500/50 bg-blue-500/5',
  Contacted: 'border-yellow-500/50 bg-yellow-500/5',
  Qualified: 'border-purple-500/50 bg-purple-500/5',
  Proposal: 'border-orange-500/50 bg-orange-500/5',
  Won: 'border-green-500/50 bg-green-500/5',
  Lost: 'border-red-500/50 bg-red-500/5',
};

const stageBadge = {
  New: 'bg-blue-500/20 text-blue-400',
  Contacted: 'bg-yellow-500/20 text-yellow-400',
  Qualified: 'bg-purple-500/20 text-purple-400',
  Proposal: 'bg-orange-500/20 text-orange-400',
  Won: 'bg-green-500/20 text-green-400',
  Lost: 'bg-red-500/20 text-red-400',
};

export default function Pipeline() {
  const [columns, setColumns] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      const res = await api.get('/leads');
      const grouped = {};
      STAGES.forEach(s => grouped[s] = []);
      res.data.forEach(lead => {
        if (grouped[lead.stage]) grouped[lead.stage].push(lead);
      });
      setColumns(grouped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceCol = [...columns[source.droppableId]];
    const destCol = source.droppableId === destination.droppableId ? sourceCol : [...columns[destination.droppableId]];

    const [moved] = sourceCol.splice(source.index, 1);
    moved.stage = destination.droppableId;
    destCol.splice(destination.index, 0, moved);

    setColumns(prev => ({
      ...prev,
      [source.droppableId]: sourceCol,
      [destination.droppableId]: destCol,
    }));

    try {
      await api.patch('/leads/' + draggableId, { stage: destination.droppableId });
    } catch (err) {
      console.error(err);
      fetchLeads();
    }
  };

  const totalValue = (stage) => {
    return columns[stage]?.reduce((sum, l) => sum + (l.value || 0), 0) || 0;
  };

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center h-64 text-gray-400">Loading pipeline...</div>
    </Layout>
  );

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Pipeline</h1>
        <p className="text-gray-400 text-sm mt-1">Drag and drop leads between stages</p>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STAGES.map(stage => (
            <div key={stage} className="flex-shrink-0 w-64">
              <div className={"rounded-2xl border p-3 min-h-96 " + stageColors[stage]}>
                <div className="flex justify-between items-center mb-3 px-1">
                  <div>
                    <span className={"text-xs font-semibold px-2 py-1 rounded-full " + stageBadge[stage]}>
                      {stage}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">{columns[stage]?.length || 0}</span>
                  </div>
                  {totalValue(stage) > 0 && (
                    <span className="text-xs text-gray-500">Rs {totalValue(stage).toLocaleString()}</span>
                  )}
                </div>

                <Droppable droppableId={stage}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={"min-h-64 rounded-xl transition-all duration-200 " + (snapshot.isDraggingOver ? "bg-white/5" : "")}>
                      {columns[stage]?.map((lead, index) => (
                        <Draggable key={lead._id} draggableId={lead._id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={"bg-gray-900 border rounded-xl p-3 mb-2 transition-all duration-200 cursor-grab active:cursor-grabbing " +
                                (snapshot.isDragging
                                  ? "border-blue-500/50 shadow-lg shadow-blue-500/20 rotate-1 scale-105"
                                  : "border-gray-800 hover:border-gray-600 hover:shadow-md")}>
                              <div className="flex justify-between items-start mb-2">
                                <p className="text-white text-sm font-medium leading-tight">{lead.name}</p>
                                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ml-2">
                                  {lead.name.charAt(0)}
                                </div>
                              </div>
                              {lead.company && (
                                <p className="text-gray-500 text-xs mb-2 flex items-center gap-1">
                                  <i className="ti ti-building text-xs"></i>
                                  {lead.company}
                                </p>
                              )}
                              {lead.value > 0 && (
                                <p className="text-green-400 text-xs font-medium">
                                  Rs {Number(lead.value).toLocaleString()}
                                </p>
                              )}
                              {lead.source && (
                                <div className="mt-2 flex items-center gap-1">
                                  <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full capitalize">{lead.source}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {columns[stage]?.length === 0 && !snapshot.isDraggingOver && (
                        <div className="flex items-center justify-center h-24 text-gray-700 text-xs border-2 border-dashed border-gray-800 rounded-xl">
                          Drop leads here
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>
    </Layout>
  );
}
