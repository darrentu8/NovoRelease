
export default function () {
  return {
    loading: false,
    projectIsList: true,
    searchProject: '',
    shareList: [],
    currentProject: {},
    editProjectData: {
      name: '',
      user_id: '',
      approve: false,
      uid: ''
    },
    projects: [],
    shareProjects: []
  }
}
