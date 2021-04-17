# Custom Streamlit components - React templates

**Note: These components can be built and linked to Python code in the form of artifacts.
Preparing and using this environment is necessary only for dev work.**

## Prepare React JS env (required only for dev)
```
cd template/component_name/frontend
npm install    # Install npm dependencies
npm run start  # Start the Webpack dev server
```

After running these component will run as a server. Streamlit can connect to it in order to use it.
The specified dev test scenario (specified below `if not _RELEASE:` line of `__init__.py`) could be run in Streamlit executing:
```
streamlit run ../__init__.py 
```
