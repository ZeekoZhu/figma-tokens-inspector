import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { FigmaFileContext } from '../../stores';

export const InspectorPage = observer(() => {
  const figmaFileManager = useContext(FigmaFileContext);
  return (
    <div>File id: {figmaFileManager.fileId}</div>
  );
});
