import { v4 as uuidv4 } from 'uuid';

const initObject = {
  content: [],
  root: {props: {}},
  zones: {}
}

const generateComponentId = (componentName: string) => {
  return `${componentName}-${uuidv4()}`
}

const migrateText = (str: string) : any => {
  const content = {
    type: 'Text',
    props: {
      id: generateComponentId('Text'),
      text: str,
    }
  }
  let component = { content, root: initObject.root, zones: initObject.zones }
  return component
}

const migrateHtml = (str: string) : any => {
  const content = {
    type: 'HTML',
    props: {
      id: generateComponentId('HTML'),
      content: str,
    }
  }
  let component = { content, root: initObject.root, zones: initObject.zones }
  return component
}

export const migrate = (str: string, componentName: string):  any => {
  const migrationMap = {
    Text: migrateText,
    Html: migrateHtml,
  }

  const migrationFn = migrationMap[componentName as keyof typeof migrationMap]
  
  if (migrationFn) {
    return migrationFn(str)
  } else {
    return str
  }
}