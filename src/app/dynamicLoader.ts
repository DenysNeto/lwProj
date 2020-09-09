import { LuwfyAsyncEachLoopBlock } from '@luwfy/luwfy-block-async-each';
import { LuwfyAsyncEachLoopCallbackBlock } from '@luwfy/luwfy-block-async-each';
import { LuwfyBatchBlock } from '@luwfy/luwfy-block-batch';
import { LuwfyChangeBlock } from '@luwfy/luwfy-block-change';
import { LuwfyCommentBlock } from '@luwfy/luwfy-block-comment';
import { LuwfyComponentBlock } from '@luwfy/luwfy-block-component';
import { LuwfyDebugBlock } from '@luwfy/luwfy-block-debug';
import { LuwfyDebugSettingsBlock } from '@luwfy/luwfy-block-debug';
import { LuwfyDelayBlock } from '@luwfy/luwfy-block-delay';
import { LuwfyFormBlock } from '@luwfy/luwfy-block-form-ui';
import { LuwfyFunctionBlock } from '@luwfy/luwfy-block-function';
import { LuwfyGoToBlock } from '@luwfy/luwfy-block-go-to';
import { LuwfyHttpRequestBlock } from '@luwfy/luwfy-block-httprequest';
import { LuwfyIbanComposeBlock } from '@luwfy/luwfy-block-iban';
import { LuwfyIbanExtractBlock } from '@luwfy/luwfy-block-iban';
import { LuwfyIbanValidateBlock } from '@luwfy/luwfy-block-iban';
import { LuwfyInjectBlock } from '@luwfy/luwfy-block-inject';
import { LuwfyJSONBlock } from '@luwfy/luwfy-block-json';
import { LuwfyRangeBlock } from '@luwfy/luwfy-block-range';
import { LuwfyRxjsSubscriberBlock } from '@luwfy/luwfy-block-rxjs';
import { LuwfyRxjsObserverBlock } from '@luwfy/luwfy-block-rxjs';
import { LuwfySortBlock } from '@luwfy/luwfy-block-sort';
import { LuwfySplitNodeBlock } from '@luwfy/luwfy-block-split';
import { LuwfyJoinNodeBlock } from '@luwfy/luwfy-block-split';
import { LuwfySwitchBlock } from '@luwfy/luwfy-block-switch';
import { LuwfyTemplateBlock } from '@luwfy/luwfy-block-template';
import { LuwfyTriggerBlock } from '@luwfy/luwfy-block-trigger';
import { LuwfyViewInBlock } from '@luwfy/luwfy-block-view';
import { LuwfyViewPrintBlock } from '@luwfy/luwfy-block-view';
import { LuwfyWSClientIn } from '@luwfy/luwfy-block-websocket';
import { LuwfyWSClientOut } from '@luwfy/luwfy-block-websocket';
import { LuwfyXMLBlock } from '@luwfy/luwfy-block-xml';
import { LuwfyYAMLBlock } from '@luwfy/luwfy-block-yaml';

export var blocksLuwfy = { "async each":LuwfyAsyncEachLoopBlock,
"async each callback":LuwfyAsyncEachLoopCallbackBlock,
"batch":LuwfyBatchBlock,
"change":LuwfyChangeBlock,
"comment":LuwfyCommentBlock,
"component":LuwfyComponentBlock,
"debug":LuwfyDebugBlock,
"debug settings":LuwfyDebugSettingsBlock,
"delay":LuwfyDelayBlock,
"form ui":LuwfyFormBlock,
"function":LuwfyFunctionBlock,
"go to":LuwfyGoToBlock,
"http request":LuwfyHttpRequestBlock,
"IBAN Compose":LuwfyIbanComposeBlock,
"IBAN Extract":LuwfyIbanExtractBlock,
"IBAN Validate":LuwfyIbanValidateBlock,
"inject":LuwfyInjectBlock,
"json":LuwfyJSONBlock,
"range":LuwfyRangeBlock,
"rx subscriber":LuwfyRxjsSubscriberBlock,
"rx observer":LuwfyRxjsObserverBlock,
"sort":LuwfySortBlock,
"split":LuwfySplitNodeBlock,
"join":LuwfyJoinNodeBlock,
"switch":LuwfySwitchBlock,
"template":LuwfyTemplateBlock,
"trigger":LuwfyTriggerBlock,
"view in":LuwfyViewInBlock,
"view print":LuwfyViewPrintBlock,
"Websocket in":LuwfyWSClientIn,
"Websocket out":LuwfyWSClientOut,
"xml":LuwfyXMLBlock,
"YAML":LuwfyYAMLBlock,
}